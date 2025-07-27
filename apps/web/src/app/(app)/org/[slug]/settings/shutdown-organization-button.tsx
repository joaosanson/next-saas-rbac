import { getCurrentOrg } from '@/auth/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { shutdownOrganization } from '@/http/shutdown-organization';
import { redirect } from 'next/navigation';

export function ShutdownOrganizationButton() {
  async function shutdownOrganizationAction() {
    'use server';

    const currentOrg = await getCurrentOrg();

    await shutdownOrganization({ org: currentOrg! });

    redirect('/');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="content-start bg-transparent p-0 text-red-400 hover:bg-transparent underline">
          Shutdown organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={shutdownOrganizationAction}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this organizations?
            </DialogTitle>
            <DialogDescription>
              Deleting this organization is permanent and cannot be undone. All
              data will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between gap-4 pt-2">
            <DialogClose asChild>
              <Button
                className="flex-1 text-amber-50 hover:underline bg-transparent hover:bg-transparent"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="flex-1 content-start bg-transparent p-0 text-red-400 hover:bg-transparent hover:underline"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
