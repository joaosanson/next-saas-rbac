'use server';

import { HTTPError } from 'ky';
import { createProjectActionSchema, createProjectActionType } from './types';

export async function createProjectAction(data: createProjectActionType) {
  const result = createProjectActionSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const { name, description } = result.data;

  try {
    // await createProject({
    //   name,
    //   description,
    // });
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
