'use client';

import type { UpdateProjectRequest } from '@/types/project';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { projectApi } from '@services/project.service';
import { useQueryClient } from '@tanstack/react-query';

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: (payload: UpdateProjectRequest) =>
      projectApi.updateProject(projectId, payload),
    onSuccess: async (project) => {
      queryClient.setQueryData(['projects-detail', projectId], project);
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    ...mutation,
    updateProject: (payload: UpdateProjectRequest) =>
      mutation.mutateAsync(payload),
  };
}
