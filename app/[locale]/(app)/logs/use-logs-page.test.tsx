import type { DeployListItem, ProjectListItem } from '@/types/project';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLogsPage } from './use-logs-page';

const replace = vi.fn();

const mockProjects: ProjectListItem[] = [
  {
    id: 'project-1',
    name: 'Alpha',
    repoFullName: 'acme/alpha',
    deployBranch: 'main',
    latestDeploy: {
      id: 'latest-1',
      status: 'SUCCESS',
      commitSha: 'aaa111',
      commitMessage: 'Ship alpha',
      createdAt: '2026-07-01T10:00:00.000Z',
      finishedAt: '2026-07-01T10:05:00.000Z',
      trigger: 'MANUAL',
    },
    deployCount: 3,
    repoUrl: 'https://github.com/acme/alpha',
    webhookId: null,
    isWebhookProvisioned: false,
  },
  {
    id: 'project-2',
    name: 'Beta',
    repoFullName: 'acme/beta',
    deployBranch: 'main',
    latestDeploy: {
      id: 'latest-2',
      status: 'BUILDING',
      commitSha: 'bbb222',
      commitMessage: 'Ship beta',
      createdAt: '2026-07-02T10:00:00.000Z',
      finishedAt: null,
      trigger: 'MANUAL',
    },
    deployCount: 6,
    repoUrl: 'https://github.com/acme/beta',
    webhookId: null,
    isWebhookProvisioned: false,
  },
];

const mockDeploymentsByProject: Record<string, DeployListItem[]> = {
  'project-1': [
    {
      id: 'deployment-a2',
      projectId: 'project-1',
      deploymentNumber: 2,
      status: 'SUCCESS',
      trigger: 'MANUAL',
      branch: 'main',
      commitSha: 'aaa222',
      commitMessage: 'Deploy alpha 2',
      queuedAt: '2026-07-01T10:00:00.000Z',
      createdAt: '2026-07-01T10:00:00.000Z',
      finishedAt: '2026-07-01T10:05:00.000Z',
    },
  ],
  'project-2': [
    {
      id: 'deployment-b3',
      projectId: 'project-2',
      deploymentNumber: 3,
      status: 'BUILDING',
      trigger: 'MANUAL',
      branch: 'main',
      commitSha: 'bbb333',
      commitMessage: 'Deploy beta 3',
      queuedAt: '2026-07-02T10:00:00.000Z',
      createdAt: '2026-07-02T10:00:00.000Z',
      finishedAt: null,
    },
    {
      id: 'deployment-b2',
      projectId: 'project-2',
      deploymentNumber: 2,
      status: 'FAILED',
      trigger: 'MANUAL',
      branch: 'main',
      commitSha: 'bbb222',
      commitMessage: 'Deploy beta 2',
      queuedAt: '2026-07-01T10:00:00.000Z',
      createdAt: '2026-07-01T10:00:00.000Z',
      finishedAt: '2026-07-01T10:05:00.000Z',
    },
  ],
};

const mockSearchParams = new URLSearchParams();

vi.mock('@i18n/navigation', () => ({
  usePathname: () => '/logs',
  useRouter: () => ({
    replace,
  }),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

vi.mock('@lib/hooks', () => ({
  useTranslateError: () => ({
    getErrorMessage: () => '',
  }),
}));

vi.mock('@/features/projects/hooks', () => ({
  useGetProject: vi.fn(() => ({
    data: {
      items: mockProjects,
      meta: {
        page: 1,
        limit: 50,
        total: 2,
        totalPage: 1,
      },
    },
    isError: false,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('@/features/deployments', () => ({
  useGetProjectDeployments: vi.fn((projectId: string) => ({
    data: mockDeploymentsByProject[projectId] ?? [],
    isError: false,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('@/features/logs', () => ({
  useGetDeploymentLogs: vi.fn(({ deploymentId }: { deploymentId: string }) => ({
    data: deploymentId ? [] : [],
    isError: false,
    isLoading: false,
    error: null,
  })),
}));

describe('useLogsPage', () => {
  beforeEach(() => {
    replace.mockClear();
    mockSearchParams.delete('projectId');
    mockSearchParams.delete('deploymentId');
    mockSearchParams.delete('q');
  });

  it('selects the latest available project and its newest deployment when the URL is empty', async () => {
    const { result } = renderHook(() => useLogsPage());

    await waitFor(() => {
      expect(result.current.selectedProject?.id).toBe('project-2');
      expect(result.current.selectedDeployment?.id).toBe('deployment-b3');
    });

    expect(replace).toHaveBeenCalledWith('/logs?projectId=project-2');
    expect(replace).toHaveBeenCalledWith('/logs?projectId=project-2&deploymentId=deployment-b3');
  });

  it('resets deployment selection to the newest run when switching projects', async () => {
    mockSearchParams.set('projectId', 'project-2');
    mockSearchParams.set('deploymentId', 'deployment-b2');

    const { result } = renderHook(() => useLogsPage());

    await waitFor(() => {
      expect(result.current.selectedDeployment?.id).toBe('deployment-b2');
    });

    result.current.onProjectChange('project-1');

    expect(replace).toHaveBeenLastCalledWith('/logs?projectId=project-1');
  });
});
