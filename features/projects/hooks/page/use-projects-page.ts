'use client';

import { env } from '@/env';
import { useGetMe } from '@/features/auth/hooks';
import { useGetProject } from '@/features/projects/hooks/actions';
import type { ProjectsViewMode } from '@/features/projects/types';
import { usePathname, useRouter } from '@i18n/navigation';
import { getApiErrorMessage } from '@lib/utils/error';
import { useSearchParams } from 'next/navigation';
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';

const DEFAULT_LIMIT = 6;
const GITHUB_CONNECT_STATUS = ['connected', 'error'] as const;
const GITHUB_CONNECT_REASONS = [
  'access_denied',
  'invalid_state',
  'user_not_found',
  'already_connected',
  'account_in_use',
  'authorization_expired',
  'oauth_configuration_error',
  'connection_failed',
] as const;

type GithubConnectStatus = (typeof GITHUB_CONNECT_STATUS)[number];
type GithubConnectReason = (typeof GITHUB_CONNECT_REASONS)[number];

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
  const githubConnectStatusParam = searchParams.get('connectGithub');
  const githubConnectReasonParam = searchParams.get('reason');
  const githubConnectStatus = GITHUB_CONNECT_STATUS.includes(
    githubConnectStatusParam as GithubConnectStatus
  )
    ? (githubConnectStatusParam as GithubConnectStatus)
    : null;
  const githubConnectReason = GITHUB_CONNECT_REASONS.includes(
    githubConnectReasonParam as GithubConnectReason
  )
    ? (githubConnectReasonParam as GithubConnectReason)
    : null;

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
  const githubConnected = me?.githubConnection.isConnected !== false;

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

  const handleConnectGithub = () => {
    window.location.assign(`${env.NEXT_PUBLIC_API_URL}/github/oauth/login`);
  };

  const handleCreateNew = () => {
    router.push('/new');
  };

  const handleDismissGithubConnectStatus = () => {
    updateParams({ connectGithub: null, reason: null });
  };

  return {
    canCreateProject: githubConnected,
    currentPage,
    errorMessage: getApiErrorMessage(error),
    filteredProjects,
    githubConnected,
    githubConnectReason,
    githubConnectStatus,
    hasSearchQuery: deferredSearch.length > 0,
    isError,
    isLoading,
    onConnectGithub: handleConnectGithub,
    onCreateNew: handleCreateNew,
    onDismissGithubConnectStatus: handleDismissGithubConnectStatus,
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
