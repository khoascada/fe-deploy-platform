'use client';

import type { LogsResponse } from '@/types/log';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { logApi } from '@services/log.service';
import { useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { deploymentLogsQueryKey, mergeDeploymentLogs } from '../utils/deployment-logs-query';

interface UseGetDeploymentLogsParams {
  deploymentId: string;
  projectId: string;
}

type GetDeploymentLogsOptions = Omit<
  UseQueryOptions<LogsResponse, ApiError, LogsResponse, ReturnType<typeof deploymentLogsQueryKey>>,
  'queryKey' | 'queryFn'
>;

export function useGetDeploymentLogs(
  { deploymentId, projectId }: UseGetDeploymentLogsParams,
  options?: GetDeploymentLogsOptions
) {
  const queryClient = useQueryClient();
  const queryKey = deploymentLogsQueryKey(projectId, deploymentId);
  const enabled = projectId.length > 0 && deploymentId.length > 0 && options?.enabled !== false;

  return useAppQuery({
    ...options,
    queryKey,
    queryFn: async () => {
      const snapshot = await logApi.getLogsByDeploymentId({ projectId, deploymentId });
      const streamedLogs = queryClient.getQueryData<LogsResponse>(queryKey) ?? [];

      return mergeDeploymentLogs(snapshot, streamedLogs);
    },
    enabled,
  });
}
