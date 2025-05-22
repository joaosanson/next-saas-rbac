'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const organizationSchema = z.object({
  name: z.string(),
  domain: z.string().nullish(),
  shouldAttachUsersByDomain: z.boolean().optional(),
});

type OrganizationType = z.infer<typeof organizationSchema>;

export default function CreateOrganization() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationType>({
    resolver: zodResolver(organizationSchema),
  });

  async function onSubmit(data: any) {
    // .push("/auth/sign-in")
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create organization</h1>

      <form className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
          {/* {errors.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400"></p>
          )} */}
        </div>

        <div className="space-y-1">
          <Label htmlFor="domain">Domain</Label>
          <Input
            type="text"
            id="domain"
            inputMode="url"
            placeholder="example.com"
          />
          {/* {errors.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400"></p>
          )} */}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              className="translate-y-1 cursor-pointer"
              name="shouldAttachUsersByDomain"
              id="shouldAttachUsersByDomain"
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
            {/* {errors.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400"></p>
          )} */}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          // disabled={isSubmitting}
        >
          {/* {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign up'
          )} */}
          Save organization
        </Button>
      </form>
    </div>
  );
}
