'use server';

import { createOrganization } from '@/http/create-organization';
import { HTTPError } from 'ky';
import {
  createOrganizationActionSchema,
  createOrganizationActionType,
} from './types';

export async function createOrganizationAction(
  data: createOrganizationActionType
) {
  const result = createOrganizationActionSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data;

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: 'Unexpected error occurred. Please, try again later.',
      errors: null,
    };
  }

  return {
    success: true,
    message: 'Successfully created the organization',
    errors: null,
  };
}
