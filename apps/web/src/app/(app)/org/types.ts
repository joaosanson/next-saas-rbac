import { z } from 'zod';

export const organizationSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters long.' }),
  domain: z
    .string()
    .nullable()
    .refine(
      (value) => {
        if (value) {
          const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return domainRegex.test(value);
        }
        return true;
      },
      {
        message: 'Please, provide a valid domain.',
      }
    ),
  shouldAttachUsersByDomain: z.boolean(),
});

export const createOrganizationFormSchema = organizationSchema;

export const createOrganizationActionSchema = organizationSchema
  .extend({
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
        return false;
      }
      return true;
    },
    {
      message: 'Domain is required when attaching users by domain.',
      path: ['domain'],
    }
  );

export type OrganizationType = z.infer<typeof organizationSchema>;
export type createOrganizationActionType = z.infer<
  typeof createOrganizationActionSchema
>;
