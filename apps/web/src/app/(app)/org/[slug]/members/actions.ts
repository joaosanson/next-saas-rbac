'use server';

import { getCurrentOrg } from '@/auth/auth';
import { removeMember } from '@/http/remove-member';
import { RevokeInvite } from '@/http/revoke-invite';
import { updateMember } from '@/http/update-member';
import { Role } from '@saas/auth';
import { revalidateTag } from 'next/cache';

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg();

  await removeMember({ memberId, org: currentOrg! });

  revalidateTag(`${currentOrg}/members`);
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = await getCurrentOrg();

  await updateMember({ memberId, org: currentOrg!, role });

  revalidateTag(`${currentOrg}/members`);
}

export async function revokeInviteAction(inviteId: string) {
  {
    const currentOrg = await getCurrentOrg();

    await RevokeInvite({ inviteId, org: currentOrg! });

    revalidateTag(`${currentOrg}/invites`);
  }
}
