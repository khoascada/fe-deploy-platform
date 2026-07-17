'use client';

import type { LogItem as DeploymentLogItem, LogStream } from '@/types/log';
import { useGetDeploymentLogs } from '@features/logs/hooks/use-get-deployment-logs';
import { useTranslateError } from '@lib/hooks';

interface UseRealtimeLogsCardOptions {
  deploymentId?: string | null;
  logs?: DeploymentLogItem[];
  projectId?: string;
}

export function useRealtimeLogsCard({ deploymentId, projectId }: UseRealtimeLogsCardOptions) {
  const { getErrorMessage } = useTranslateError();
  const { data, error, isError, isLoading } = useGetDeploymentLogs(
    {
      deploymentId: deploymentId ?? '',
      projectId: projectId ?? '',
    },
    {
      enabled: Boolean(projectId && deploymentId),
    }
  );

  const resolvedLogs = data ?? [];
  const latestLog = resolvedLogs.at(-1) ?? null;
  const isLoadingLogs = isLoading;
  const logsErrorMessage = isError ? getErrorMessage(error) : '';
  const streamCounts = resolvedLogs.reduce<Record<LogStream, number>>(
    (accumulator, log) => {
      accumulator[log.stream] += 1;
      return accumulator;
    },
    {
      STDERR: 0,
      STDOUT: 0,
      SYSTEM: 0,
    }
  );

  return {
    isError,
    isLoadingLogs,
    latestLog,
    logsErrorMessage,
    resolvedLogs,
    streamCounts,
  };
}
