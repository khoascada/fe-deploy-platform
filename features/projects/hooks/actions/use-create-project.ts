'use client';

import type { CreateProjectRequest } from '@/types/project';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { projectApi } from '@services/project.service';
import { useQueryClient } from '@tanstack/react-query';

export function useCreateProject() {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: (payload: CreateProjectRequest) => projectApi.createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  });

  const createProject = async (payload: CreateProjectRequest) => {
    return mutation.mutateAsync(payload);
  };

  return {
    ...mutation,
    createProject,
  };
}
