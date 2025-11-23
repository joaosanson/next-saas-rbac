'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import githubIcon from '@/assets/github-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithGithub } from '../actions'
import { signUpWithEmailAndPassword } from './actions'

const signUpSchema = z
  .object({
    name: z.string().refine((name) => name.split(' ').length > 1, {
      message: 'Please, provide your full name.',
    }),
    email: z.string().email(),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long.',
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match.',
    path: ['password_confirmation'],
  })

type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(data: SignUpFormData) {
    await signUpWithEmailAndPassword(data)

    router.push('/auth/sign-in')
  }
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input type="email" id="email" {...register('email')} />
          {errors.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" {...register('password')} />
          {errors.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            type="password"
            id="password_confirmation"
            {...register('password_confirmation')}
          />
          {errors.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign up'
          )}
        </Button>

        <Button
          variant="link"
          className="w-full cursor-pointer"
          size="sm"
          asChild
        >
          <Link href={'/auth/sign-in'}>Already registered? Sign in</Link>
        </Button>
      </form>
      <Separator />

      <form action={signInWithGithub} className="space-y-4">
        <Button
          type="submit"
          variant="outline"
          className="w-full cursor-pointer"
        >
          <Image src={githubIcon} className="size-5 dark:invert" alt="" />
          Sign in with Github
        </Button>
      </form>
    </div>
  )
}
