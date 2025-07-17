'use client';

import { getProjects } from '@/http/get-projects';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react';
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
import { Skeleton } from './ui/skeleton';

export function ProjectSwitcher() {
  const { slug: orgSlug, project: projectSlug } = useParams<{
    slug: string;
    project: string;
  }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['projects', orgSlug],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const currentProject =
    data && projectSlug
      ? data.projects.find((project) => project.slug === projectSlug)
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {isLoading ? (
          <>
            <Skeleton className="mr-2 size-4 shrink-0 rounded-full" />
            <Skeleton className="mr-2 h-4 w-full" />
          </>
        ) : error ? (
          <span className="text-destructive">
            {error instanceof Error && error.message.includes('401')
              ? 'Authentication required'
              : 'Failed to load projects'}
          </span>
        ) : (
          <>
            {currentProject ? (
              <>
                <Avatar className="mr-2 size-4">
                  {currentProject.avatarUrl && (
                    <AvatarImage src={currentProject.avatarUrl} />
                  )}
                  <AvatarFallback />
                </Avatar>
                <span className="truncate text-left">
                  {currentProject.name}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">Select project</span>
            )}
          </>
        )}
        {isLoading ? (
          <Loader2 className="text-muted-foreground ml-auto size-4 shrink-0 animate-spin" />
        ) : (
          <ChevronsUpDown className="text-muted-foreground ml-auto size-4 shrink-0" />
        )}
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
          ) : !data?.projects || data.projects.length === 0 ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">No projects found</span>
            </DropdownMenuItem>
          ) : (
            data.projects.map((project) => (
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
          <Link
            href={`/org/${orgSlug}/create-project`}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
