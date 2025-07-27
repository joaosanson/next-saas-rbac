'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createProjectAction } from './actions';
import { projectSchema, ProjectType } from './types';

export default function ProjectForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(data: ProjectType) {
    setServerError(null);
    const { success, errors, message } = await createProjectAction(data);

    if (!success && message) {
      setServerError(errors?.name || message);
      return;
    }
    if (success && message) {
      setServerSuccess(message);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Project creation failed!</AlertTitle>
            <AlertDescription>
              <p>{serverError}</p>
            </AlertDescription>
          </Alert>
        )}

        {serverSuccess && (
          <Alert variant="success">
            <AlertTitle>{serverSuccess}</AlertTitle>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" type="text" {...register('name')} />

          {errors.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder=""
            {...register('description')}
          />

          {errors.description && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.description.message}
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
            'Create Project'
          )}
        </Button>
      </form>
    </div>
  );
}
