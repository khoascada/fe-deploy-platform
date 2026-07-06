'use client';

import { useAppMutation } from '@lib/hooks/use-react-query';
import { projectApi } from '@services/project.service';
import { useQueryClient } from '@tanstack/react-query';

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: (projectId: string) => projectApi.deleteProject(projectId),
    onSuccess: async (_data, projectId) => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['projects-detail', projectId] });
    },
  });

  return {
    ...mutation,
    deleteProject: (projectId: string) => mutation.mutateAsync(projectId),
  };
}
