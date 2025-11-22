'use server';

import { acceptInvite } from "@/http/accept-invite";
import { signInWithPassword } from '@/http/sign-in-with-password';
import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { z } from 'zod';

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Please, provide your password.' }),
});

type SignInData = z.infer<typeof signInSchema>;

export async function signInWithEmailAndPassword(data: SignInData) {
  const cookieStore = await cookies();

  const result = signInSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { token } = await signInWithPassword({ email, password });

    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

    const inviteId = cookieStore.get('inviteId')?.value;

    if (inviteId) {
      try {
        await acceptInvite(inviteId);
        cookieStore.delete('inviteId');
      } catch (error) {
        console.error(error);
      }
    }
    
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

  return { success: true, message: null, errors: null };
}
