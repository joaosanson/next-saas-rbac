import { prisma } from '@/lib/prisma';
import { env } from "@saas/env";
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { BadRequestError } from '../_errors/bad-request-error';

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate Github',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body;

      try {
        const githubOAuthURL = new URL(
          'https://github.com/login/oauth/access_token'
        );

        githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
        githubOAuthURL.searchParams.set(
          'client_secret',
          env.GITHUB_OAUTH_CLIENT_SECRET
        );
        githubOAuthURL.searchParams.set(
          'redirect_uri',
          env.GITHUB_OAUTH_CLIENT_REDIRECT_URI
        );
        githubOAuthURL.searchParams.set('code', code);

        const githubAccessTokenResponse = await fetch(githubOAuthURL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        });

        const githubAccessTokenData = await githubAccessTokenResponse.json();

        console.log('GitHub Access Token Data:', githubAccessTokenData);

        const zGitHubError = z.object({
          error: z.string(),
          error_description: z.string().optional(),
          error_uri: z.string().optional(),
        });

        const errorResult = zGitHubError.safeParse(githubAccessTokenData);

        if (errorResult.success) {
          throw new BadRequestError(
            `GitHub OAuth error: ${errorResult.data.error_description} (${errorResult.data.error})`
          );
        }

        const { access_token: githubAccessToken } = z
          .object({
            access_token: z.string(),
            token_type: z.literal('bearer'),
            scope: z.string(),
          })
          .parse(githubAccessTokenData);

        const githubUserResponse = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
          },
        });

        const githubUserData = await githubUserResponse.json();

        console.log('GitHub User Data:', githubUserData);

        const {
          id: githubId,
          name,
          email,
          avatar_url: avatarUrl,
        } = z
          .object({
            id: z.number().int().transform(String),
            avatar_url: z.string().url(),
            name: z.string().nullable(),
            email: z.string().email().nullable(),
          })
          .parse(githubUserData);

        console.log(githubId, name, email, avatarUrl);
        if (!email) {
          throw new BadRequestError(
            'Your Github account must have an email to authenticate.'
          );
        }

        let user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name,
              email,
              avatarUrl,
            },
          });
        }

        let account = await prisma.account.findUnique({
          where: {
            provider_userId: {
              provider: 'GITHUB',
              userId: user.id,
            },
          },
        });

        if (!account) {
          account = await prisma.account.create({
            data: {
              provider: 'GITHUB',
              userId: user.id,
              providerAccountId: githubId,
            },
          });
        }

        const token = await reply.jwtSign(
          {
            sub: user.id,
          },
          {
            sign: {
              expiresIn: '7d',
            },
          }
        );

        return reply.status(201).send({
          token,
        });
      } catch (error) {
        console.error('Error in authenticateWithGithub:', error);
        throw error;
      }
    }
  );
}
