import type {
  CreateEnvVarRequest,
  EnvVar,
  UpdateEnvVarRequest,
} from '@/types/env-var';
import apiClient from '@lib/api/api-client';
import type { ApiResponse } from '@lib/types/base';

export const envVarApi = {
  async getProjectEnvVars(projectId: string): Promise<EnvVar[]> {
    const response = await apiClient.get<ApiResponse<EnvVar[]>>(
      `/projects/${projectId}/env-vars`,
    );
    return response.data.data;
  },

  async createProjectEnvVar(projectId: string, payload: CreateEnvVarRequest) {
    const response = await apiClient.post<ApiResponse<EnvVar>>(
      `/projects/${projectId}/env-vars`,
      payload,
    );
    return response.data.data;
  },

  async updateProjectEnvVar(
    projectId: string,
    envVarId: string,
    payload: UpdateEnvVarRequest,
  ) {
    const response = await apiClient.patch<ApiResponse<EnvVar>>(
      `/projects/${projectId}/env-vars/${envVarId}`,
      payload,
    );
    return response.data.data;
  },

  async deleteProjectEnvVar(projectId: string, envVarId: string) {
    await apiClient.delete(`/projects/${projectId}/env-vars/${envVarId}`);
  },
};
