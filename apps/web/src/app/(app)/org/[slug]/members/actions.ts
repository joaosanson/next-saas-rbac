'use server'

import { Role } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { getCurrentOrg } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
import { removeMember } from '@/http/remove-member'
import { RevokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

import { createInviteActionType, createInviteFormSchema } from './types'

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await removeMember({ memberId, org: currentOrg! })

  revalidateTag(`${currentOrg}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = await getCurrentOrg()

  await updateMember({ memberId, org: currentOrg!, role })

  revalidateTag(`${currentOrg}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = await getCurrentOrg()

  await RevokeInvite({ inviteId, org: currentOrg! })

  revalidateTag(`${currentOrg}/invites`)
}

export async function createInviteAction(data: createInviteActionType) {
  const result = createInviteFormSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, role } = result.data

  const org = await getCurrentOrg()

  if (!org) {
    return {
      success: false,
      message: 'Organization not found. Please, select an organization.',
      errors: null,
    }
  }

  try {
    await createInvite({
      org,
      email,
      role,
    })

    revalidateTag(`${org}/invites`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      console.log(err, { email, org, role })

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error occurred. Please, try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created the invite',
    errors: null,
  }
}
