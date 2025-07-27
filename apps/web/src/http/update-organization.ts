import { api } from './api-client';

interface updateOrganizationRequest {
  org: string
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean | null;
}

type CreateOrganizationResponse = void;

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain
}: updateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api.put(`organizations/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain
    },
  });
}
