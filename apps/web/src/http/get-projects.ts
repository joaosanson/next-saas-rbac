import { api } from './api-client';

interface GetProjectsResponse {
  projects: {
    name: string;
    id: string;
    slug: string;
    avatarUrl: string | null;
    createdAt: string;
    ownerId: string;
    organizationId: string;
    description: string;
    owner: {
      name: string | null;
      id: string;
      avatarUrl: string | null;
    };
  }[];
}

export async function getProjects(org: string) {
  // TODO: Lembrar de tirar
  await new Promise((resolve) => setTimeout(resolve, 1000)); 

  const result = await api
    .get(`organizations/${org}/projects`)
    .json<GetProjectsResponse>();

  return result;
}
