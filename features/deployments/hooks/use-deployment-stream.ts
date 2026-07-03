'use client';

import type { LogItem, LogLevel, LogStream } from '@/types/log';
import type { DeployStatus } from '@/types/project';
import { createSseConnection } from '@lib/sse';
import { useEffect, useEffectEvent } from 'react';

interface UseDeploymentStreamParams {
  deploymentId: string;
  deploymentStatus?: DeployStatus | null;
  enabled?: boolean;
  onLogCreated?: (event: DeploymentLogCreatedEvent) => void;
  onStatusChanged?: (event: DeploymentStatusChangedEvent) => void;
  projectId: string;
}

const ACTIVE_DEPLOYMENT_STATUSES = new Set<DeployStatus>([
  'QUEUED',
  'PULLING',
  'BUILDING',
  'DEPLOYING',
]);

const DEPLOY_STATUS_VALUES = new Set<DeployStatus>([
  'QUEUED',
  'PULLING',
  'BUILDING',
  'DEPLOYING',
  'SUCCESS',
  'FAILED',
  'CANCELED',
]);

const LOG_LEVELS = new Set<LogLevel>(['DEBUG', 'INFO', 'WARN', 'ERROR']);
const LOG_STREAMS = new Set<LogStream>(['SYSTEM', 'STDOUT', 'STDERR']);

export type DeploymentLogCreatedEvent = Omit<LogItem, 'id'> & {
  type: 'deployment-log.created';
};

export interface DeploymentStatusChangedEvent {
  type: 'deployment-status.changed';
  deploymentId: string;
  errorMessage?: string | null;
  finishedAt?: string | null;
  projectId: string;
  status: DeployStatus;
  updatedAt: string;
}

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

function isDeploymentStatusChangedEvent(value: unknown): value is DeploymentStatusChangedEvent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const event = value as Record<string, unknown>;

  return (
    event.type === 'deployment-status.changed' &&
    typeof event.deploymentId === 'string' &&
    typeof event.projectId === 'string' &&
    typeof event.status === 'string' &&
    DEPLOY_STATUS_VALUES.has(event.status as DeployStatus) &&
    typeof event.updatedAt === 'string' &&
    (event.finishedAt === undefined || event.finishedAt === null || typeof event.finishedAt === 'string') &&
    (event.errorMessage === undefined ||
      event.errorMessage === null ||
      typeof event.errorMessage === 'string')
  );
}

export function useDeploymentStream({
  deploymentId,
  deploymentStatus,
  enabled = true,
  onLogCreated,
  onStatusChanged,
  projectId,
}: UseDeploymentStreamParams) {
  // useEffectEvent dùng để tạo 1 callback luôn nhìn thấy state mới nhất nhưng ko làm useEffect re-run
  const handleLogCreated = useEffectEvent((event: DeploymentLogCreatedEvent) => {
    onLogCreated?.(event);
  });
  const handleStatusChanged = useEffectEvent((event: DeploymentStatusChangedEvent) => {
    onStatusChanged?.(event);
  });
  const shouldSubscribe =
    enabled &&
    projectId.length > 0 &&
    deploymentId.length > 0 &&
    Boolean(deploymentStatus && ACTIVE_DEPLOYMENT_STATUSES.has(deploymentStatus));

  useEffect(() => {
    if (!shouldSubscribe) {
      return;
    }

    const { disconnect } = createSseConnection({
      url: `/api/v1/projects/${encodeURIComponent(projectId)}/deployments/${encodeURIComponent(deploymentId)}/stream`,
      onEvent: (eventName, data) => {
        if (eventName === 'deployment-log.created') {
          if (
            !isDeploymentLogCreatedEvent(data) ||
            data.projectId !== projectId ||
            data.deploymentId !== deploymentId
          ) {
            return;
          }

          handleLogCreated(data);
          return;
        }

        if (eventName === 'deployment-status.changed') {
          console.log('eventttt', data)
          if (
            !isDeploymentStatusChangedEvent(data) ||
            data.projectId !== projectId ||
            data.deploymentId !== deploymentId
          ) {
            return;
          }

          handleStatusChanged(data);
        }
      },
    });

    return disconnect;
  }, [deploymentId, handleLogCreated, handleStatusChanged, projectId, shouldSubscribe]);
}
