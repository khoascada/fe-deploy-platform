'use client';

import type { DeploymentLogCreatedEvent } from '@/features/deployments';
import type { LogsResponse } from '@/types/log';
import { useQueryClient } from '@tanstack/react-query';
import { deploymentLogsQueryKey, mergeDeploymentLogs } from '../utils/deployment-logs-query';

interface UseDeploymentLogCreatedHandlerParams {
  deploymentId: string;
  projectId: string;
}

export function useDeploymentLogCreatedHandler({
  deploymentId,
  projectId,
}: UseDeploymentLogCreatedHandlerParams) {
  const queryClient = useQueryClient();

  return (event: DeploymentLogCreatedEvent) => {
    const queryKey = deploymentLogsQueryKey(projectId, deploymentId);

    queryClient.setQueryData<LogsResponse>(queryKey, (currentLogs = []) =>
      mergeDeploymentLogs(currentLogs, [
        {
          id: `${event.deploymentId}:${event.seq}`,
          createdAt: event.createdAt,
          deploymentId: event.deploymentId,
          level: event.level,
          message: event.message,
          projectId: event.projectId,
          seq: event.seq,
          stream: event.stream,
        },
      ])
    );
  };
}
