'use client';

import type { UpdateEnvVarRequest } from '@/types/env-var';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { envVarApi } from '@services/env-var.service';
import { useQueryClient } from '@tanstack/react-query';
import { projectEnvVarsQueryKey } from './use-get-project-env-vars';

export function useUpdateEnvVar(projectId: string) {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: ({ envVarId, payload }: { envVarId: string; payload: UpdateEnvVarRequest }) =>
      envVarApi.updateProjectEnvVar(projectId, envVarId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: projectEnvVarsQueryKey(projectId),
      });
    },
  });

  return {
    ...mutation,
    updateEnvVar: (envVarId: string, payload: UpdateEnvVarRequest) =>
      mutation.mutateAsync({ envVarId, payload }),
  };
}
