import apiClient from '@lib/api/api-client';
import type { ApiResponse } from '@lib/types/base';
import type { CreateProjectRequest, ProjectDetail, ProjectListParams, ProjectListResponse } from '@/types/project';

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

  async getProject(projectId: string): Promise<ProjectDetail> {
    const response = await apiClient.get<ApiResponse<ProjectDetail>>(`/projects/${projectId}`);
    return response.data.data;
  },

  async createProject(payload: CreateProjectRequest) {
    const response = await apiClient.post<ApiResponse<{ id: string }>>('/projects', payload);
    return response.data.data;
  },
};
