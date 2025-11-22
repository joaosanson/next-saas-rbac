import { auth, isAuthenticated } from '@/auth/auth';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { acceptInvite } from '@/http/accept-invite';
import { getInvite } from '@/http/get-invite';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckCircle, LogIn, LogOut } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

dayjs.extend(relativeTime);

interface InvitePageProps {
  params: { id: string };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { id } = await params;

  const { invite } = await getInvite(id);

  const isUserAuthenticated = await isAuthenticated();

  let currentUserEmail = null;

  if (isUserAuthenticated) {
    const { user } = await auth();

    currentUserEmail = user.email;
  }

  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite.email;

  async function signInFromInvite() {
    'use server';

    const cookieStore = await cookies();

    cookieStore.set('inviteId', id);

    redirect(`/auth/sign-in?email=${invite.email}`);
  }

  async function acceptInviteAction() {
    'use server';

    await acceptInvite(id);

    redirect(`/`);
  }

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
            invited you to join{' '}
            <span className="font-semibold">{invite.organization.name}</span>{' '}
            {dayjs(invite.createdAt).fromNow()}.
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="mr-2 size-4" />
              Sign in to accept the invite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircle className="mr-2 size-4" />
              Join {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-muted-foreground loading-relaxed text-center text-sm text-balance">
              You are already signed in with a different email.
            </p>

            <div className="space-y-2">
              <Button variant="secondary" className="w-full" asChild>
                <a href="/api/auth/sign-out">
                  <LogOut className="mr-2 size-4" />
                  Sign out from {currentUserEmail}
                </a>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
