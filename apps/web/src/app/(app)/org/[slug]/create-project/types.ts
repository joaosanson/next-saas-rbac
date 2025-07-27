import { z } from 'zod';

export const projectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters long.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long.' }),
});

export const createProjectFormSchema = projectSchema;

export type ProjectType = z.infer<typeof projectSchema>;
export type createProjectActionType = z.infer<typeof createProjectFormSchema>;
