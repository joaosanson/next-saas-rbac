'use client';

import { getProjects } from '@/http/get-projects';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{
    slug: string;
  }>();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects', orgSlug],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug, // Only run query if orgSlug exists
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {/* {currentOrganization ? (
          <>
            <Avatar className="mr-2 size-4">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left">
              {currentOrganization.name}
            </span>
          </>
        ) : (*/}
        <span className="text-muted-foreground">Select project</span>
        {/* )} */}
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" alignOffset={-16} className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {isLoading ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">Loading projects...</span>
            </DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem disabled>
              <span className="text-destructive">
                {error instanceof Error && error.message.includes('401')
                  ? 'Authentication required'
                  : 'Failed to load projects'}
              </span>
            </DropdownMenuItem>
          ) : !projects?.projects || projects.projects.length === 0 ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">No projects found</span>
            </DropdownMenuItem>
          ) : (
            projects.projects.map((project) => (
              <DropdownMenuItem key={project.id} asChild>
                <Link
                  href={`/org/${orgSlug}/project/${project.slug}`}
                  className="flex items-center"
                >
                  <Avatar className="mr-2 size-4">
                    {project.avatarUrl && (
                      <AvatarImage src={project.avatarUrl} />
                    )}
                    <AvatarFallback />
                  </Avatar>
                  <span className="line-clamp-1">{project.name}</span>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
