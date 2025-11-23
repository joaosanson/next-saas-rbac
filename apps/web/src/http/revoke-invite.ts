import { api } from './api-client'

interface RevokeInviteRequest {
  org: string
  inviteId: string
}

export async function RevokeInvite({ org, inviteId }: RevokeInviteRequest) {
  await api.delete(`organizations/${org}/invites/${inviteId}`)
}
