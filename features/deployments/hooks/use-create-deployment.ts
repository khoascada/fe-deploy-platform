'use client';

import type { CreateDeploymentResponse } from '@/types/deployment';
import type { ProjectDetail } from '@/types/project';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { deploymentApi } from '@services/deployment.service';
import { useQueryClient } from '@tanstack/react-query';

function buildQueuedLatestDeploy(
  deployment: CreateDeploymentResponse,
  previousProject: ProjectDetail | undefined
): ProjectDetail['latestDeploy'] {
  const previousLatestDeploy = previousProject?.latestDeploy;

  return {
    id: deployment.id,
    status: deployment.status,
    commitSha: previousLatestDeploy?.commitSha ?? '',
    commitMessage: previousLatestDeploy?.commitMessage ?? null,
    createdAt: deployment.createdAt,
    finishedAt: null,
    trigger: deployment.trigger,
  };
}

export function useCreateDeployment(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['projects', 'detail', projectId] as const;

  const mutation = useAppMutation({
    mutationFn: () => deploymentApi.createDeployment(projectId),
    onSuccess: (deployment: CreateDeploymentResponse) => {
      queryClient.setQueryData<ProjectDetail | undefined>(queryKey, (previousProject) => {
        if (!previousProject) {
          return previousProject;
        }

        return {
          ...previousProject,
          latestDeploy: buildQueuedLatestDeploy(deployment, previousProject),
        };
      });

      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const createDeployment = async () => {
    return mutation.mutateAsync();
  };

  return {
    ...mutation,
    createDeployment,
  };
}