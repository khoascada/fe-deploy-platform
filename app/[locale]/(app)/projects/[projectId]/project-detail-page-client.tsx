'use client';

import { useGetProjectDetail } from '@/features/projects/hooks';
import { getApiErrorMessage } from '@lib/utils/error';
import { ProjectDetailPageView } from './project-detail-page-view';

interface ProjectDetailPageClientProps {
  projectId: string;
}

export function ProjectDetailPageClient({ projectId }: ProjectDetailPageClientProps) {
  const { data, error, isError, isLoading, refetch } = useGetProjectDetail(projectId);

  return (
    <ProjectDetailPageView
      project={data}
      error={error}
      errorMessage={getApiErrorMessage(error)}
      isError={isError}
      isLoading={isLoading}
      onRetry={() => void refetch()}
    />
  );
}
