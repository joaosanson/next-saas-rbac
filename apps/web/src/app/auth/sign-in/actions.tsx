'use server';

import { signInWithPassword } from '@/http/sign-in-with-password';
import { HTTPError } from 'ky';
import { z } from 'zod';

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Please, provide your password.' }),
});

type SignInData = z.infer<typeof signInSchema>;

export async function signInWithEmailAndPassword(data: SignInData) {
  const result = signInSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { token } = await signInWithPassword({ email, password });
    console.log(token);
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();

      return { success: false, message, errors: null };
    }

    console.error(err);

    return {
      success: false,
      message: 'Unexpected error occurred. Please, try again later.',
      errors: null,
    };
  }

  return { success: true, message: null, errors: null };
}
