'use client';

import type { ProjectListParams, ProjectListResponse } from '@/types/project';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { projectApi } from '@services/project.service';
import type { UseQueryOptions } from '@tanstack/react-query';

type GetProjectOptions = Omit<
  UseQueryOptions<ProjectListResponse, ApiError, ProjectListResponse, (string | number)[]>,
  'queryKey' | 'queryFn'
>;

export function useGetProject(params: ProjectListParams = {}, options?: GetProjectOptions) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 6;
  const search = params.search ?? '';

  return useAppQuery({
    queryKey: ['projects', page, limit, search],
    queryFn: () => projectApi.getProjects({ page, limit, search }),
    enabled: false,
    ...options,
  });
}
