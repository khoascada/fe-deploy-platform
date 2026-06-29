import type { CreateDeploymentResponse } from '@/types/deployment';
import apiClient from '@lib/api/api-client';
import type { ApiResponse } from '@lib/types/base';

export const deploymentApi = {
  async createDeployment(projectId: string): Promise<CreateDeploymentResponse> {
    const response = await apiClient.post<ApiResponse<CreateDeploymentResponse>>(
      `/projects/${projectId}/deployments`
    );

    return response.data.data;
  },
};