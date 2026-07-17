import type { CreateDeploymentResponse, DeploymentsResponse } from '@/types/deployment';
import apiClient from '@lib/api/api-client';
import type { ApiResponse } from '@lib/types/base';

export const deploymentApi = {
  async getDeployments(projectId: string, limit = 20): Promise<DeploymentsResponse> {
    const response = await apiClient.get<ApiResponse<DeploymentsResponse>>(
      `/projects/${projectId}/deployments`,
      {
        params: { limit },
      }
    );

    return response.data.data;
  },

  async createDeployment(projectId: string): Promise<CreateDeploymentResponse> {
    const response = await apiClient.post<ApiResponse<CreateDeploymentResponse>>(
      `/projects/${projectId}/deployments`
    );

    return response.data.data;
  },
};
