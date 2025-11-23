'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine((name) => name.split(' ').length > 1),
    email: z.string().email(),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long.',
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

type SignUpData = z.infer<typeof signUpSchema>

export async function signUpWithEmailAndPassword(data: SignUpData) {
  const result = signUpSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  try {
    await signUp({ name, email, password })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error occurred. Please, try again later.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
