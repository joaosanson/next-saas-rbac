import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get projects where user is a member',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              projects: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { organization } = await request.getUserMembership(slug);

        const projects = await prisma.project.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        });

        return {
          projects,
        };
      }
    );
}
