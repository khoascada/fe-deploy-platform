import type { GithubBranchResponse, GithubRepoResponse } from '@/types/github';
import apiClient from '@lib/api/api-client';
import type { ApiResponse } from '@lib/types/base';

export const githubApi = {
  async getListRepos(isRefresh = false): Promise<GithubRepoResponse> {
    const response = await apiClient.get<ApiResponse<GithubRepoResponse>>('/github/repos', {
      params: {
        isRefresh,
      },
    });

    return response.data.data;
  },

  async getListBranches(owner: string, repo: string, isRefresh = false): Promise<GithubBranchResponse> {
    const response = await apiClient.get<ApiResponse<GithubBranchResponse>>(
      `/github/repos/${owner}/${repo}/branches`,
      {
        params: {
          isRefresh,
        },
      }
    );

    return response.data.data;
  },
};
