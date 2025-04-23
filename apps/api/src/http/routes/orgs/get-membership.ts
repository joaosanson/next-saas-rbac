import { auth } from '@/http/middlewares/auth';
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organizations'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          summary: 'Get the membership of an organization',
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                role: z.array(roleSchema),
                organizationId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { membership } = await request.getUserMembership(slug);

        return {
          membership: {
            role: membership.role,
            id: membership.id,
            organizationId: membership.organizationId,
          },
        };
      }
    );
}
