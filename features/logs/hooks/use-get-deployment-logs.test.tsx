import type { LogItem, LogsResponse } from '@/types/log';
import { logApi } from '@services/log.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deploymentLogsQueryKey } from '../utils/deployment-logs-query';
import { useGetDeploymentLogs } from './use-get-deployment-logs';

vi.mock('@services/log.service', () => ({
  logApi: {
    getLogsByDeploymentId: vi.fn(),
  },
}));

const PROJECT_ID = 'project-1';
const DEPLOYMENT_ID = 'deployment-1';

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

describe('useGetDeploymentLogs', () => {
  beforeEach(() => {
    vi.mocked(logApi.getLogsByDeploymentId).mockReset();
  });

  it('merges cached streamed logs that arrive before the HTTP snapshot resolves', async () => {
    let resolveSnapshot: (logs: LogsResponse) => void = () => undefined;
    const snapshotPromise = new Promise<LogsResponse>((resolve) => {
      resolveSnapshot = resolve;
    });
    vi.mocked(logApi.getLogsByDeploymentId).mockReturnValue(snapshotPromise);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const queryKey = deploymentLogsQueryKey(PROJECT_ID, DEPLOYMENT_ID);
    const { result } = renderHook(
      () =>
        useGetDeploymentLogs({
          deploymentId: DEPLOYMENT_ID,
          projectId: PROJECT_ID,
        }),
      { wrapper: createWrapper(queryClient) }
    );

    act(() => {
      queryClient.setQueryData<LogsResponse>(queryKey, [createLog('stream-log', 2)]);
    });

    await act(async () => {
      resolveSnapshot([createLog('snapshot-log', 1)]);
      await snapshotPromise;
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([createLog('snapshot-log', 1), createLog('stream-log', 2)]);
  });
});
