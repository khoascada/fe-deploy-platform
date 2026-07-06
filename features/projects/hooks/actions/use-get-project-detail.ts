'use client';

import type { ProjectDetail } from '@/types/project';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { projectApi } from '@services/project.service';
import type { UseQueryOptions } from '@tanstack/react-query';

type GetProjectDetailOptions = Omit<
  UseQueryOptions<ProjectDetail, ApiError, ProjectDetail, string[]>,
  'queryKey' | 'queryFn'
>;

export function useGetProjectDetail(projectId: string, options?: GetProjectDetailOptions) {
  return useAppQuery({
    queryKey: ['projects-detail', projectId],
    queryFn: () => projectApi.getProject(projectId),
    enabled: projectId.length > 0,
    ...options,
  });
}
