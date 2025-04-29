'use client';

import githubIcon from '@/assets/github-icon.svg';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signInWithEmailAndPassword } from './actions';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>();

  async function onSubmit(data: SignInFormData) {
    setServerError(null);
    const { success, errors, message } = await signInWithEmailAndPassword(data);

    if (!success && message) {
      setServerError(errors?.email || message);
      return;
    }

    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{serverError}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          type="email"
          id="email"
          {...register('email', { required: 'E-mail is required' })}
        />

        {errors.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          {...register('password', { required: 'Password is required' })}
        />

        {errors.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password.message}
          </p>
        )}

        <Link
          href={'/auth/forgot-password'}
          className="text-foreground text-xs font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign in with e-mail'
        )}
      </Button>
      <Button
        variant="link"
        className="w-full cursor-pointer"
        size="sm"
        asChild
      >
        <Link href={'/auth/sign-up'}>Create new account</Link>
      </Button>
      <Separator />
      <Button type="submit" variant="outline" className="w-full cursor-pointer">
        <Image src={githubIcon} className="size-5 dark:invert" alt="" />
        Sign in with Github
      </Button>
    </form>
  );
}
