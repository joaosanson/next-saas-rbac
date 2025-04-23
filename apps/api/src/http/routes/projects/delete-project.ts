import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { organizationSchema, projectSchema } from '@saas/auth';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import z from 'zod';
import { BadRequestError } from "../_errors/bad-request-error";

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Delete a project',
          security: [
            {
              bearerAuth: [],
            },
          ],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const {projectId} = request.params;

        const userId = await request.getCurrentUserId();
        const { membership, organization } =
          await request.getUserMembership(slug);

        const project = await prisma.project.findUnique({
          where: { id: projectId, organizationId: organization.id },
        })

        if (!project) {
          throw new BadRequestError('Project not found');
        }

        const authProject = projectSchema.parse(project);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('delete', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to shutdown this organization.'
          );
        }

        await prisma.project.delete({
          where: { id: project.id },
        });

        return reply.status(204).send();
      }
    );
}
