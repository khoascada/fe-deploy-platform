'use client';

import type { GithubRepoResponse, GithubRepository } from '@/types/github';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { githubApi } from '@services/github.service';
import type { UseQueryOptions } from '@tanstack/react-query';

export interface GithubRepositoryOption {
  value: string;
  label: string;
  repository: GithubRepository;
}

type GetGithubReposOptions = Omit<
  UseQueryOptions<GithubRepoResponse, ApiError, GithubRepositoryOption[], string[]>,
  'queryKey' | 'queryFn' | 'select'
>;

export function useGetGithubRepos(options?: GetGithubReposOptions) {
  return useAppQuery({
    queryKey: ['github', 'repos'],
    queryFn: () => githubApi.getListRepos(),
    select: (response) =>
      response.items.map((repository) => ({
        value: repository.id,
        label: repository.fullName,
        repository,
      })),
    ...options,
  });
}
