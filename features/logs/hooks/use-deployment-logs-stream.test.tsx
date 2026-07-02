import type { LogItem, LogsResponse } from '@/types/log';
import { createSseConnection, type SseOptions } from '@lib/sse';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deploymentLogsQueryKey } from '../utils/deployment-logs-query';
import { useDeploymentLogsStream } from './use-deployment-logs-stream';

const PROJECT_ID = 'project-1';
const DEPLOYMENT_ID = 'deployment-1';
let connectionOptions: SseOptions | undefined;
const disconnect = vi.fn();

vi.mock('@lib/sse', () => ({
  createSseConnection: vi.fn((options: SseOptions) => {
    connectionOptions = options;
    return { disconnect };
  }),
}));

function createLog(id: string, seq: number): LogItem {
  return {
    id,
    createdAt: '2026-07-02T00:00:00.000Z',
    deploymentId: DEPLOYMENT_ID,
    level: 'INFO',
    message: id,
    projectId: PROJECT_ID,
    seq,
    stream: 'STDOUT',
  };
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useDeploymentLogsStream', () => {
  beforeEach(() => {
    connectionOptions = undefined;
    disconnect.mockClear();
    vi.mocked(createSseConnection).mockClear();
  });

  it('appends valid active-deployment events, deduplicates, and preserves sequence order', () => {
    const queryClient = new QueryClient();
    const queryKey = deploymentLogsQueryKey(PROJECT_ID, DEPLOYMENT_ID);
    queryClient.setQueryData<LogsResponse>(queryKey, [createLog('log-2', 2)]);

    renderHook(
      () =>
        useDeploymentLogsStream({
          deploymentId: DEPLOYMENT_ID,
          deploymentStatus: 'BUILDING',
          projectId: PROJECT_ID,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    expect(connectionOptions?.url).toBe(
      `/api/v1/projects/${PROJECT_ID}/deployments/${DEPLOYMENT_ID}/logs/stream`
    );

    act(() => {
      const { id: _id, ...log1 } = createLog('log-1', 1);
      const { id: _duplicateId, ...log2 } = createLog('log-2', 2);
      connectionOptions?.onEvent?.('deployment-log.created', {
        ...log1,
        type: 'deployment-log.created',
      });
      connectionOptions?.onEvent?.('deployment-log.created', {
        ...log2,
        type: 'deployment-log.created',
      });
      connectionOptions?.onEvent?.('deployment-log.created', { deploymentId: DEPLOYMENT_ID });
    });

    expect(queryClient.getQueryData(queryKey)).toEqual([
      { ...createLog('log-1', 1), id: `${DEPLOYMENT_ID}:1` },
      createLog('log-2', 2),
    ]);
  });

  it('does not subscribe for a terminal deployment', () => {
    const queryClient = new QueryClient();
    const queryKey = deploymentLogsQueryKey(PROJECT_ID, DEPLOYMENT_ID);

    renderHook(
      () =>
        useDeploymentLogsStream({
          deploymentId: DEPLOYMENT_ID,
          deploymentStatus: 'SUCCESS',
          projectId: PROJECT_ID,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    expect(createSseConnection).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(queryKey)).toBeUndefined();
  });
});
