import apiClient from '@lib/api/api-client';
import type { ApiResponse } from '@lib/types/base';
import type { ProjectListParams, ProjectListResponse } from '@/types/project';

export const projectApi = {
  async getProjects(params: ProjectListParams = {}): Promise<ProjectListResponse> {
    const response = await apiClient.get<ApiResponse<ProjectListResponse>>('/projects', {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    });

    return response.data.data;
  },
};
