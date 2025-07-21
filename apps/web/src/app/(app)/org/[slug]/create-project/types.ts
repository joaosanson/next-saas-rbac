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

export const createProjectActionSchema = projectSchema.extend({
  shouldAttachUsersByDomain: z
    .union([z.literal('on'), z.literal('off'), z.boolean()])
    .transform((value) => value === true || value === 'on')
    .default(false),
});

export type ProjectType = z.infer<typeof projectSchema>;
export type createProjectActionType = z.infer<typeof createProjectActionSchema>;
