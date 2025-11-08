import { isAuthenticated } from "@/auth/auth";
import { Avatar } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInvite } from '@/http/get-invite';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LogIn } from "lucide-react";

dayjs.extend(relativeTime);

interface InvitePageProps {
  params: { id: string };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteId = params.id;

  const { invite } = await getInvite(inviteId);

  const isUserAuthenticated = isAuthenticated()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl ? (
              <img
                src={invite.author.avatarUrl}
                alt={invite.author.name ?? 'Avatar'}
              />
            ) : invite.author?.name ? (
              invite.author.name.charAt(0)
            ) : (
              invite.email.charAt(0)
            )}
          </Avatar>

          <p className="text-muted-foreground text-center leading-relaxed text-balance">
            <span className="font-semibold">
              {invite.author?.name ?? 'Someone'}
            </span>{' '}
            invited you to join   <span className="font-semibold">{invite.organization.name}</span>{' '}
            {dayjs(invite.createdAt).fromNow()}.
          </p>
        </div>

        <Separator />

        {!isAuthenticated && (
          <form action="">
            <Button type="submit" variant="secondary">
              <LogIn className="size-4 mr-2"/>
              Sign in to accept the invite
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
