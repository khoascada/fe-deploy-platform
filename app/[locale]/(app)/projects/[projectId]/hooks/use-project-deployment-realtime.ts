'use client';

import { useDeploymentStream, type DeploymentStatusChangedEvent } from '@/features/deployments';
import { useDeploymentLogCreatedHandler } from '@/features/logs';
import { useProjectDeploymentStream, type DeploymentCreatedEvent } from '@/features/projects';
import type { DeploymentsResponse } from '@/types/deployment';
import type { ProjectDetail } from '@/types/project';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UseProjectDeploymentRealtimeParams {
  project?: ProjectDetail;
}

const PROJECT_DETAIL_DEPLOYMENTS_LIMIT = 20;

export function useProjectDeploymentRealtime({ project }: UseProjectDeploymentRealtimeParams) {
  const queryClient = useQueryClient();
  const projectId = project?.id ?? '';
  const deploymentId = project?.latestDeploy?.id ?? '';
  const deploymentStatus = project?.latestDeploy?.status ?? null;

  const handleDeploymentCreated = useCallback(
    (event: DeploymentCreatedEvent) => {
      const current = queryClient.getQueryData<ProjectDetail>(['projects-detail', projectId]);
      if (current?.latestDeploy?.id !== event.deploymentId) {
        void queryClient.invalidateQueries({
          queryKey: ['projects-detail', projectId],
        });
      }

      void queryClient.invalidateQueries({
        queryKey: ['project-deployments', projectId],
      });
    },
    [projectId, queryClient]
  );

  useProjectDeploymentStream({
    projectId,
    enabled: Boolean(projectId),
    onDeploymentCreated: handleDeploymentCreated,
  });

  // merge log vao list log
  const handleLogCreated = useDeploymentLogCreatedHandler({
    deploymentId,
    projectId,
  });

  // optimistic status in latestDeploy and deployment history
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

      queryClient.setQueryData<DeploymentsResponse>(
        ['project-deployments', projectId, PROJECT_DETAIL_DEPLOYMENTS_LIMIT],
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
