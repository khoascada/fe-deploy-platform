'use client';

import type { LogItem, LogLevel, LogsResponse, LogStream } from '@/types/log';
import type { DeployStatus } from '@/types/project';
import { createSseConnection } from '@lib/sse';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { deploymentLogsQueryKey, mergeDeploymentLogs } from '../utils/deployment-logs-query';

interface UseDeploymentLogsStreamParams {
  deploymentId: string;
  deploymentStatus?: DeployStatus | null;
  enabled?: boolean;
  projectId: string;
}

const ACTIVE_DEPLOYMENT_STATUSES = new Set<DeployStatus>([
  'QUEUED',
  'PULLING',
  'BUILDING',
  'DEPLOYING',
]);
const LOG_LEVELS = new Set<LogLevel>(['DEBUG', 'INFO', 'WARN', 'ERROR']);
const LOG_STREAMS = new Set<LogStream>(['SYSTEM', 'STDOUT', 'STDERR']);

type DeploymentLogCreatedEvent = Omit<LogItem, 'id'> & { type: 'deployment-log.created' };

function isDeploymentLogCreatedEvent(value: unknown): value is DeploymentLogCreatedEvent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const log = value as Record<string, unknown>;

  return (
    log.type === 'deployment-log.created' &&
    typeof log.deploymentId === 'string' &&
    typeof log.projectId === 'string' &&
    typeof log.seq === 'number' &&
    typeof log.level === 'string' &&
    LOG_LEVELS.has(log.level as LogLevel) &&
    typeof log.stream === 'string' &&
    LOG_STREAMS.has(log.stream as LogStream) &&
    typeof log.message === 'string' &&
    typeof log.createdAt === 'string'
  );
}

export function useDeploymentLogsStream({
  deploymentId,
  deploymentStatus,
  enabled = true,
  projectId,
}: UseDeploymentLogsStreamParams) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => deploymentLogsQueryKey(projectId, deploymentId),
    [deploymentId, projectId]
  );
  const shouldSubscribe =
    enabled &&
    projectId.length > 0 &&
    deploymentId.length > 0 &&
    Boolean(deploymentStatus && ACTIVE_DEPLOYMENT_STATUSES.has(deploymentStatus));

  useEffect(() => {
    if (!shouldSubscribe) return;

    const { disconnect } = createSseConnection({
      url: `/api/v1/projects/${encodeURIComponent(projectId)}/deployments/${encodeURIComponent(deploymentId)}/logs/stream`,
      onEvent: (eventName, data) => {
        if (
          eventName !== 'deployment-log.created' ||
          !isDeploymentLogCreatedEvent(data) ||
          data.projectId !== projectId ||
          data.deploymentId !== deploymentId
        )
          return;

        const log: LogItem = {
          id: `${data.deploymentId}:${data.seq}`,
          deploymentId: data.deploymentId,
          projectId: data.projectId,
          seq: data.seq,
          level: data.level,
          stream: data.stream,
          message: data.message,
          createdAt: data.createdAt,
        };
        queryClient.setQueryData<LogsResponse>(queryKey, (currentLogs = []) =>
          mergeDeploymentLogs(currentLogs, [log])
        );
      },
    });

    return disconnect;
  }, [deploymentId, projectId, queryClient, queryKey, shouldSubscribe]);
}
