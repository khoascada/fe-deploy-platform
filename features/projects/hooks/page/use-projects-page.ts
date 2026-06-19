'use client';

import { useGetMe } from '@/features/auth/hooks';
import { useGetProject } from '@/features/projects/hooks/actions';
import type { ProjectsViewMode } from '@/features/projects/types';
import { getApiErrorMessage } from '@lib/utils/error';
import { usePathname, useRouter } from '@i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';

const DEFAULT_LIMIT = 6;

function toPositiveInteger(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

export function useProjectsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentPage = toPositiveInteger(searchParams.get('page'), 1);
  const currentSearch = searchParams.get('q') ?? '';
  const currentView = searchParams.get('view') === 'list' ? 'list' : 'grid';

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [viewMode, setViewMode] = useState<ProjectsViewMode>(currentView);

  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    setViewMode(currentView);
  }, [currentView]);

  const {
    data: listProjects,
    error,
    isError,
    isLoading,
    refetch,
  } = useGetProject({
    page: currentPage,
    limit: DEFAULT_LIMIT,
    search: '',
  });
  const { data: me } = useGetMe();
  const githubConnected = me?.github_connected !== false;

  const deferredSearch = useDeferredValue(searchQuery.trim().toLowerCase());

  const filteredProjects = useMemo(() => {
    const projects = listProjects?.projects ?? [];

    if (!deferredSearch) {
      return projects;
    }

    return projects.filter((project) => {
      return [project.name, project.repoFullName, project.appUrl ?? '']
        .join(' ')
        .toLowerCase()
        .includes(deferredSearch);
    });
  }, [deferredSearch, listProjects?.projects]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(nextUrl);
    });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page: String(page) });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateParams({ q: value.trim() || null, page: '1' });
  };

  const handleViewModeChange = (nextViewMode: ProjectsViewMode) => {
    setViewMode(nextViewMode);
    updateParams({ view: nextViewMode === 'grid' ? null : nextViewMode });
  };

  return {
    canCreateProject: githubConnected,
    currentPage,
    errorMessage: getApiErrorMessage(error),
    filteredProjects,
    githubConnected,
    hasSearchQuery: deferredSearch.length > 0,
    isError,
    isLoading,
    onPageChange: handlePageChange,
    onRetry: () => void refetch(),
    onSearchChange: handleSearchChange,
    onViewModeChange: handleViewModeChange,
    searchQuery,
    totalPages: listProjects?.totalPage ?? 0,
    totalProjects: listProjects?.total ?? 0,
    viewMode,
  };
}
