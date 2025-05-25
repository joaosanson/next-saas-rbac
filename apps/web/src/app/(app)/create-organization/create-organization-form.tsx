'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createOrganizationAction } from './actions';
import { createOrganizationSchema, CreateOrganizationType } from './types';

export default function createOrganizationForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationType>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      domain: '',
      shouldAttachUsersByDomain: false,
    },
  });

  async function onSubmit(data: CreateOrganizationType) {
    setServerError(null);
    const { success, errors, message } = await createOrganizationAction(data);

    if (!success && message) {
      setServerError(errors?.name || message);
      return;
    }
    if (success && message) {
      setServerSuccess(message);
    }

    router.push('/');
  }

  return (
    <div className="space-y-4">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Organization creation failed!</AlertTitle>
            <AlertDescription>
              <p>{serverError}</p>
            </AlertDescription>
          </Alert>
        )}

        {serverSuccess && (
          <Alert variant="default">
            <AlertTitle>{serverSuccess}</AlertTitle>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" {...register('name')} />

          {errors.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="domain">Domain</Label>
          <Input
            type="text"
            id="domain"
            inputMode="url"
            placeholder="example.com"
            {...register('domain')}
          />

          {errors.domain && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.domain.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              className="translate-y-1 cursor-pointer"
              id="shouldAttachUsersByDomain"
              {...register('shouldAttachUsersByDomain')}
            />
            <label htmlFor="shouldAttachUsersByDomain">
              <span className="text-sm leading-none font-medium">
                Auto-join new members
              </span>
              <p className="text-muted-foreground text-sm">
                This will automatically invite all members with same e-mail
                domain to this organization
              </p>
            </label>

            {errors.shouldAttachUsersByDomain && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.shouldAttachUsersByDomain.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Save organization'
          )}
        </Button>
      </form>
    </div>
  );
}
