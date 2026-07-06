import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProjectDeploymentStream } from './use-project-deployment-stream';

const { createSseConnection, disconnect } = vi.hoisted(() => ({
  createSseConnection: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('@lib/sse', () => ({ createSseConnection }));

describe('useProjectDeploymentStream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createSseConnection.mockReturnValue({ disconnect });
  });

  it('keeps a project stream open and forwards matching deployment events', () => {
    const onDeploymentCreated = vi.fn();
    const { unmount } = renderHook(() =>
      useProjectDeploymentStream({
        projectId: 'project-1',
        onDeploymentCreated,
      }),
    );

    expect(createSseConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/projects/project-1/deployments/stream',
      }),
    );

    const options = createSseConnection.mock.calls[0][0];
    act(() => {
      options.onEvent('deployment.created', {
        type: 'deployment.created',
        projectId: 'project-1',
        deploymentId: 'deployment-2',
        deploymentNumber: 2,
        trigger: 'GITHUB_PUSH',
        branch: 'main',
        commitSha: 'abc',
        commitMessage: 'Ship it',
        createdAt: '2026-07-06T00:00:00.000Z',
      });
    });

    expect(onDeploymentCreated).toHaveBeenCalledTimes(1);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('does not connect without a project id', () => {
    renderHook(() => useProjectDeploymentStream({ projectId: '' }));
    expect(createSseConnection).not.toHaveBeenCalled();
  });
});
