'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createInviteAction } from './actions';
import { inviteSchema, InviteType } from './types';

export default function CreateInviteForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteType>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  });

  async function onSubmit(data: InviteType) {
    setServerError(null);
    const { success, errors, message } = await createInviteAction(data);

    if (!success && message) {
      setServerError(errors?.email || message);
      return;
    }
    if (success && message) {
      setServerSuccess(message);
    }

    reset();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Invite failed!</AlertTitle>
            <AlertDescription>
              <p>{serverError}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
            />

            <div className="h-5">
              {errors.email && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="BILLING">Billing</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <div className="h-5"></div>
          </div>

          <div className="space-y-1">
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Invite user
                </>
              )}
            </Button>
            <div className="h-5"></div>
          </div>
        </div>
      </form>
    </div>
  );
}
