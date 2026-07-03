'use client';

import {
  useDeploymentStream,
  useGetProjectDeployments,
  type DeploymentStatusChangedEvent,
} from '@/features/deployments';
import { useDeploymentLogCreatedHandler, useGetDeploymentLogs } from '@/features/logs';
import { useGetProject } from '@/features/projects/hooks';
import type { DeploymentsResponse } from '@/types/deployment';
import type { DeployListItem, ProjectListItem } from '@/types/project';
import { usePathname, useRouter } from '@i18n/navigation';
import { useTranslateError } from '@lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition
} from 'react';

const PROJECTS_LIMIT = 50;
const DEPLOYMENTS_LIMIT = 20;

function getPreferredProject(projects: ProjectListItem[]) {
  return (
    [...projects]
      .filter((project) => project.latestDeploy)
      .sort((left, right) => {
        const leftDate = left.latestDeploy ? new Date(left.latestDeploy.createdAt).getTime() : 0;
        const rightDate = right.latestDeploy ? new Date(right.latestDeploy.createdAt).getTime() : 0;
        return rightDate - leftDate;
      })
      .at(0) ?? projects.at(0) ?? null
  );
}

export function useLogsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getErrorMessage } = useTranslateError();
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  const initialSearch = searchParams.get('q') ?? '';
  const currentProjectId = searchParams.get('projectId') ?? '';
  const currentDeploymentId = searchParams.get('deploymentId') ?? '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const deferredSearch = useDeferredValue(searchQuery.trim().toLowerCase());

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const projectsQuery = useGetProject(
    {
      page: 1,
      limit: PROJECTS_LIMIT,
      search: '',
    },
    {
      retry: false,
    }
  );

  const filteredProjects = useMemo(() => {
    const projects = projectsQuery.data?.items ?? [];
    if (!deferredSearch) {
      return projects;
    }

    return projects.filter((project) =>
      [project.name, project.repoFullName, project.repoUrl ?? ''].join(' ').toLowerCase().includes(deferredSearch)
    );
  }, [deferredSearch, projectsQuery.data?.items]);

  const selectedProject = useMemo(() => {
    if (currentProjectId) {
      return filteredProjects.find((project) => project.id === currentProjectId) ?? null;
    }

    return getPreferredProject(filteredProjects);
  }, [currentProjectId, filteredProjects]);

  const deploymentsQuery = useGetProjectDeployments(selectedProject?.id ?? '', DEPLOYMENTS_LIMIT, {
    enabled: Boolean(selectedProject?.id),
    retry: false,
  });

  const selectedDeployment = useMemo<DeployListItem | null>(() => {
    const deployments = deploymentsQuery.data ?? [];
    if (currentDeploymentId) {
      return deployments.find((deployment) => deployment.id === currentDeploymentId) ?? null;
    }

    return deployments.at(0) ?? null;
  }, [currentDeploymentId, deploymentsQuery.data]);

  const logsQuery = useGetDeploymentLogs(
    {
      deploymentId: selectedDeployment?.id ?? '',
      projectId: selectedProject?.id ?? '',
    },
    {
      enabled: Boolean(selectedProject?.id && selectedDeployment?.id),
      retry: false,
    }
  );

  const handleLogCreated = useDeploymentLogCreatedHandler({
    deploymentId: selectedDeployment?.id ?? '',
    projectId: selectedProject?.id ?? '',
  });

  const handleStatusChanged = useCallback((event: DeploymentStatusChangedEvent) => {
    const projectId = selectedProject?.id;

    if (!projectId) {
      return;
    }

    queryClient.setQueryData<DeploymentsResponse>(
      ['projects', projectId, 'deployments', DEPLOYMENTS_LIMIT],
      (currentDeployments) =>
        currentDeployments?.map((deployment) =>
          deployment.id === event.deploymentId
            ? {
              ...deployment,
              finishedAt: event.finishedAt ?? deployment.finishedAt,
              status: event.status,
            }
            : deployment
        ) ?? currentDeployments
    );
  }, [queryClient, selectedProject?.id]);

  useDeploymentStream({
    deploymentId: selectedDeployment?.id ?? '',
    deploymentStatus: selectedDeployment?.status ?? null,
    enabled: Boolean(selectedProject?.id && selectedDeployment?.id),
    onLogCreated: handleLogCreated,
    onStatusChanged: handleStatusChanged,
    projectId: selectedProject?.id ?? '',
  });

  const updateParams = useCallback((updates: Record<string, string | null>) => {
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
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (projectsQuery.isLoading) {
      return;
    }

    if (!selectedProject && currentProjectId) {
      updateParams({ projectId: null, deploymentId: null });
      return;
    }

    if (selectedProject && selectedProject.id !== currentProjectId) {
      updateParams({ projectId: selectedProject.id, deploymentId: null });
    }
  }, [currentProjectId, projectsQuery.isLoading, selectedProject, updateParams]);

  useEffect(() => {
    if (deploymentsQuery.isLoading) {
      return;
    }

    if (!selectedProject) {
      return;
    }

    if (!selectedDeployment && currentDeploymentId) {
      updateParams({ deploymentId: null });
      return;
    }

    if (selectedDeployment && selectedDeployment.id !== currentDeploymentId) {
      updateParams({ deploymentId: selectedDeployment.id });
    }
  }, [
    currentDeploymentId,
    deploymentsQuery.isLoading,
    selectedDeployment,
    selectedProject,
    updateParams,
  ]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateParams({ q: value.trim() || null });
  };

  const handleProjectChange = (projectId: string) => {
    updateParams({ projectId, deploymentId: null });
  };

  const handleDeploymentChange = (deploymentId: string) => {
    updateParams({ deploymentId });
  };

  return {
    deploymentErrorMessage: getErrorMessage(deploymentsQuery.error),
    deployments: deploymentsQuery.data ?? [],
    hasSearchQuery: deferredSearch.length > 0,
    isDeploymentsError: deploymentsQuery.isError,
    isDeploymentsLoading: deploymentsQuery.isLoading,
    isLogsError: logsQuery.isError,
    isLogsLoading: logsQuery.isLoading,
    isProjectsError: projectsQuery.isError,
    isProjectsLoading: projectsQuery.isLoading,
    logs: logsQuery.data ?? [],
    logsErrorMessage: getErrorMessage(logsQuery.error),
    onDeploymentChange: handleDeploymentChange,
    onProjectChange: handleProjectChange,
    onRetryDeployments: () => void deploymentsQuery.refetch(),
    onRetryProjects: () => void projectsQuery.refetch(),
    onSearchChange: handleSearchChange,
    projectErrorMessage: getErrorMessage(projectsQuery.error),
    projects: filteredProjects,
    searchQuery,
    selectedDeployment,
    selectedProject,
  };
}
