import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organizations where user is a member',
          security: [
            {
              bearerAuth: [],
            },
          ],
          response: {
            201: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: z.array(roleSchema),
                }),
              )
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const organizations = await prisma.organization.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              }
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        });

        const organizationsWithUserRole = organizations.map(({members, ...org}) => {
          return {
            ...org,
            role: members[0].role,
          }
        })

        return {
          organizations: organizationsWithUserRole,
        };
      }
    );
}
