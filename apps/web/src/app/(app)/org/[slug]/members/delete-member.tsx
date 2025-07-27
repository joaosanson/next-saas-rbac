import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserMinus } from 'lucide-react';
import { removeMemberAction } from './actions';

interface DeleteMemberProps {
  isDisabled: boolean;
  memberId: string;
}

export function DeleteMember({ isDisabled, memberId }: DeleteMemberProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} size="sm" variant="destructive">
          <UserMinus className="mr-2 size-4" />
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={removeMemberAction.bind(null, memberId)}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this user?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-between gap-4 pt-2">
            <DialogClose asChild>
              <Button className="flex-1 bg-transparent text-amber-50 hover:bg-transparent hover:underline">
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
