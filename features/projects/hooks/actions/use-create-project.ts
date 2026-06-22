'use client';

import type { CreateProjectRequest } from '@/types/project';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { projectApi } from '@services/project.service';

export function useCreateProject() {
  const mutation = useAppMutation({
    mutationFn: (payload: CreateProjectRequest) => projectApi.createProject(payload),
  });

  const createProject = async (payload: CreateProjectRequest) => {
    return mutation.mutateAsync(payload);
  };

  return {
    ...mutation,
    createProject,
  };
}
