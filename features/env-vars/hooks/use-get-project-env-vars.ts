'use client';

import type { EnvVar } from '@/types/env-var';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { envVarApi } from '@services/env-var.service';
import type { UseQueryOptions } from '@tanstack/react-query';

export const projectEnvVarsQueryKey = (projectId: string) =>
  ['projects', 'detail', projectId, 'env-vars'] as const;

type GetProjectEnvVarsOptions = Omit<
  UseQueryOptions<EnvVar[], ApiError, EnvVar[], ReturnType<typeof projectEnvVarsQueryKey>>,
  'queryKey' | 'queryFn'
>;

export function useGetProjectEnvVars(
  projectId: string,
  options?: GetProjectEnvVarsOptions,
) {
  return useAppQuery({
    queryKey: projectEnvVarsQueryKey(projectId),
    queryFn: () => envVarApi.getProjectEnvVars(projectId),
    enabled: projectId.length > 0,
    ...options,
  });
}
