import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import z from 'zod';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with e-mail & password',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          })
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!userFromEmail) {
        throw new UnauthorizedError('Invalid credentials.');
      }

      if (userFromEmail.passwordHash === null) {
        throw new UnauthorizedError(
          'User does not have a password, use social login instead.'
        );
      }

      const isPasswordCorrect = await compare(
        password,
        userFromEmail.passwordHash
      );

      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Invalid credentials.');
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      );

      return reply.status(200).send({
        token,
      });
    }
  );
}
