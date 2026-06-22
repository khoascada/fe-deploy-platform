import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { githubApi } from '@services/github.service';
import { useGetGithubRepos } from './use-get-github-repos';

vi.mock('@services/github.service', () => ({
  githubApi: {
    getListRepos: vi.fn(),
  },
}));

describe('useGetGithubRepos', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('maps repository data into autocomplete options', async () => {
    vi.mocked(githubApi.getListRepos).mockResolvedValue({
      items: [
        {
          id: '42',
          name: 'deploy-platform',
          fullName: 'khoa/deploy-platform',
          private: true,
          defaultBranch: 'main',
          url: 'https://github.com/khoa/deploy-platform',
          owner: {
            login: 'khoa',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1',
          },
        },
      ],
      meta: {
        total: 1,
      },
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetGithubRepos(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      {
        value: '42',
        label: 'khoa/deploy-platform',
        repository: {
          id: '42',
          name: 'deploy-platform',
          fullName: 'khoa/deploy-platform',
          private: true,
          defaultBranch: 'main',
          url: 'https://github.com/khoa/deploy-platform',
          owner: {
            login: 'khoa',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1',
          },
        },
      },
    ]);
  });
});
