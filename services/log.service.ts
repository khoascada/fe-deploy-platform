import type { LogsResponse } from '@/types/log';
import apiClient from '@lib/api/api-client';
import type { ApiResponse } from '@lib/types/base';

interface ArgGetList {
  projectId: string;
  deploymentId: string;
}

export const logApi = {
  async getLogsByDeploymentId({ projectId, deploymentId }: ArgGetList): Promise<LogsResponse> {
    const response = await apiClient.get<ApiResponse<LogsResponse>>(
      `/projects/${projectId}/deployments/${deploymentId}/logs`
    );

    return response.data.data;
  },
};
