'use client';

import type { DeploymentsResponse } from '@/types/deployment';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { deploymentApi } from '@services/deployment.service';
import type { UseQueryOptions } from '@tanstack/react-query';

type GetProjectDeploymentsOptions = Omit<
  UseQueryOptions<DeploymentsResponse, ApiError, DeploymentsResponse, (string | number)[]>,
  'queryKey' | 'queryFn'
>;

export function useGetProjectDeployments(
  projectId: string,
  limit = 20,
  options?: GetProjectDeploymentsOptions
) {
  return useAppQuery({
    queryKey: ['project-deployments', projectId, limit],
    queryFn: () => deploymentApi.getDeployments(projectId, limit),
    enabled: projectId.length > 0,
    ...options,
  });
}
