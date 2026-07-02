import type { LogItem, LogsResponse } from '@/types/log';

export const deploymentLogsQueryKey = (projectId: string, deploymentId: string) =>
  ['projects', projectId, 'deployments', deploymentId, 'logs'] as const;

export function mergeDeploymentLogs(...collections: LogsResponse[]): LogsResponse {
  const logsById = new Map<string, LogItem>();

  collections.flat().forEach((log) => {
    const streamIdentity = `${log.projectId}:${log.deploymentId}:${log.seq}`;
    if (!logsById.has(streamIdentity)) logsById.set(streamIdentity, log);
  });

  return Array.from(logsById.values()).sort((left, right) => left.seq - right.seq);
}
