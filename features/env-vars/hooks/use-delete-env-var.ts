'use client';

import { useAppMutation } from '@lib/hooks/use-react-query';
import { envVarApi } from '@services/env-var.service';
import { useQueryClient } from '@tanstack/react-query';
import { projectEnvVarsQueryKey } from './use-get-project-env-vars';

export function useDeleteEnvVar(projectId: string) {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: (envVarId: string) => envVarApi.deleteProjectEnvVar(projectId, envVarId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: projectEnvVarsQueryKey(projectId),
      });
    },
  });

  return {
    ...mutation,
    deleteEnvVar: (envVarId: string) => mutation.mutateAsync(envVarId),
  };
}
