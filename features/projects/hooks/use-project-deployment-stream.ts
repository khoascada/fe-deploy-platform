'use client';

import { createSseConnection } from '@lib/sse';
import { useEffect, useEffectEvent } from 'react';

export interface DeploymentCreatedEvent {
  type: 'deployment.created';
  projectId: string;
  deploymentId: string;
  deploymentNumber: number;
  trigger: 'MANUAL' | 'GITHUB_PUSH';
  branch: string;
  commitSha: string | null;
  commitMessage: string | null;
  createdAt: string;
}

interface UseProjectDeploymentStreamParams {
  projectId: string;
  enabled?: boolean;
  onDeploymentCreated?: (event: DeploymentCreatedEvent) => void;
}

function isDeploymentCreatedEvent(value: unknown): value is DeploymentCreatedEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Record<string, unknown>;
  return (
    event.type === 'deployment.created' &&
    typeof event.projectId === 'string' &&
    typeof event.deploymentId === 'string' &&
    typeof event.deploymentNumber === 'number' &&
    (event.trigger === 'MANUAL' || event.trigger === 'GITHUB_PUSH') &&
    typeof event.branch === 'string' &&
    (event.commitSha === null || typeof event.commitSha === 'string') &&
    (event.commitMessage === null || typeof event.commitMessage === 'string') &&
    typeof event.createdAt === 'string'
  );
}

export function useProjectDeploymentStream({
  projectId,
  enabled = true,
  onDeploymentCreated,
}: UseProjectDeploymentStreamParams) {
  const handleCreated = useEffectEvent((event: DeploymentCreatedEvent) => {
    onDeploymentCreated?.(event);
  });

  useEffect(() => {
    if (!enabled || !projectId) return;
    const { disconnect } = createSseConnection({
      url: `/api/v1/projects/${encodeURIComponent(projectId)}/deployments/stream`,
      onEvent: (eventName, data) => {
        if (
          eventName !== 'deployment.created' ||
          !isDeploymentCreatedEvent(data) ||
          data.projectId !== projectId
        ) {
          return;
        }
        handleCreated(data);
      },
    });
    return disconnect;
  }, [enabled, projectId]);
}
