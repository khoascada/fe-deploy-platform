'use client';

import type { CreateEnvVarRequest } from '@/types/env-var';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { envVarApi } from '@services/env-var.service';
import { useQueryClient } from '@tanstack/react-query';
import { projectEnvVarsQueryKey } from './use-get-project-env-vars';

export function useCreateEnvVar(projectId: string) {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: (payload: CreateEnvVarRequest) =>
      envVarApi.createProjectEnvVar(projectId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: projectEnvVarsQueryKey(projectId),
      });
    },
  });

  return {
    ...mutation,
    createEnvVar: (payload: CreateEnvVarRequest) => mutation.mutateAsync(payload),
  };
}
