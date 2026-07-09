'use client';

import { useDeploymentStream, type DeploymentStatusChangedEvent } from '@/features/deployments';
import { useDeploymentLogCreatedHandler } from '@/features/logs';
import { useProjectDeploymentStream, type DeploymentCreatedEvent } from '@/features/projects';
import type { ProjectDetail } from '@/types/project';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UseProjectDeploymentRealtimeParams {
  project?: ProjectDetail;
}

export function useProjectDeploymentRealtime({ project }: UseProjectDeploymentRealtimeParams) {
  const queryClient = useQueryClient();
  const projectId = project?.id ?? '';
  const deploymentId = project?.latestDeploy?.id ?? '';
  const deploymentStatus = project?.latestDeploy?.status ?? null;

  const handleDeploymentCreated = useCallback(
    (event: DeploymentCreatedEvent) => {
      const current = queryClient.getQueryData<ProjectDetail>(['projects-detail', projectId]);
      if (current?.latestDeploy?.id === event.deploymentId) return;
      void queryClient.invalidateQueries({
        queryKey: ['projects-detail', projectId],
      });
    },
    [projectId, queryClient]
  );

  useProjectDeploymentStream({
    projectId,
    enabled: Boolean(projectId),
    onDeploymentCreated: handleDeploymentCreated,
  });

  // merge log vào list log
  const handleLogCreated = useDeploymentLogCreatedHandler({
    deploymentId,
    projectId,
  });

  //  optimistic status in latestDeploy
  const handleStatusChanged = useCallback(
    (event: DeploymentStatusChangedEvent) => {
      queryClient.setQueryData<ProjectDetail>(['projects-detail', projectId], (currentProject) => {
        if (
          !currentProject?.latestDeploy ||
          currentProject.latestDeploy.id !== event.deploymentId
        ) {
          return currentProject;
        }

        return {
          ...currentProject,
          latestDeploy: {
            ...currentProject.latestDeploy,
            finishedAt: event.finishedAt ?? currentProject.latestDeploy.finishedAt,
            status: event.status,
          },
        };
      });
    },
    [projectId, queryClient]
  );

  useDeploymentStream({
    deploymentId,
    deploymentStatus,
    enabled: Boolean(projectId && deploymentId),
    onLogCreated: handleLogCreated,
    onStatusChanged: handleStatusChanged,
    projectId,
  });
}
