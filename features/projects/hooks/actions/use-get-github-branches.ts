'use client';

import type { GithubBranch, GithubBranchResponse } from '@/types/github';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { githubApi } from '@services/github.service';
import type { UseQueryOptions } from '@tanstack/react-query';

export interface GithubBranchOption {
  value: string;
  label: string;
  branch: GithubBranch;
}

type GetGithubBranchesOptions = Omit<
  UseQueryOptions<GithubBranchResponse, ApiError, GithubBranchOption[], string[]>,
  'queryKey' | 'queryFn' | 'select'
>;

export function useGetGithubBranches(
  owner: string,
  repo: string,
  options?: GetGithubBranchesOptions
) {
  return useAppQuery({
    queryKey: ['github-repos-branches', owner, repo],
    queryFn: () => githubApi.getListBranches(owner, repo),
    enabled: Boolean(owner && repo),
    select: (response) =>
      response.items.map((branch) => ({
        value: branch.name,
        label: branch.name,
        branch,
      })),
    ...options,
  });
}
