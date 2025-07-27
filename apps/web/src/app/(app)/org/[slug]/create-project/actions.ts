'use server';

import { getCurrentOrg } from '@/auth/auth';
import { createProject } from '@/http/create-projct';
import { HTTPError } from 'ky';
import {  createProjectActionType, createProjectFormSchema } from './types';

export async function createProjectAction(data: createProjectActionType) {
  const result = createProjectFormSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const { name, description } = result.data;

  const org = await getCurrentOrg();

  if (!org) {
    return {
      success: false,
      message: 'Organization not found. Please, select an organization.',
      errors: null,
    };
  }

  try {
    await createProject({
      org,
      name,
      description,
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
    message: 'Successfully created the project',
    errors: null,
  };
}
