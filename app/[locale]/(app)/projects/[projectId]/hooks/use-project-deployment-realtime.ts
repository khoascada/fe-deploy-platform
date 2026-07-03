'use client';

import { useDeploymentStream, type DeploymentStatusChangedEvent } from '@/features/deployments';
import { useDeploymentLogCreatedHandler } from '@/features/logs';
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
  
  // merge log vào list log
  const handleLogCreated = useDeploymentLogCreatedHandler({
    deploymentId,
    projectId,
  });

  //  optimistic status in latestDeploy
  const handleStatusChanged = useCallback((event: DeploymentStatusChangedEvent) => {
    queryClient.setQueryData<ProjectDetail>(['projects', 'detail', projectId], (currentProject) => {
      if (!currentProject?.latestDeploy || currentProject.latestDeploy.id !== event.deploymentId) {
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
  }, [projectId, queryClient]);

  useDeploymentStream({
    deploymentId,
    deploymentStatus,
    enabled: Boolean(projectId && deploymentId),
    onLogCreated: handleLogCreated,
    onStatusChanged: handleStatusChanged,
    projectId,
  });
}
