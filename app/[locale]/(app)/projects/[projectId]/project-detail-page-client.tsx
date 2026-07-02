'use client';

import { ProjectDetailPageView } from './project-detail-page-view';
import { useDetailPageAction } from './hooks/use-detail-page-action';

interface ProjectDetailPageClientProps {
  projectId: string;
}

export function ProjectDetailPageClient({ projectId }: ProjectDetailPageClientProps) {
  const detailPageAction = useDetailPageAction({ projectId });

  return (
    <ProjectDetailPageView
      deployErrorMessage={detailPageAction.deployErrorMessage}
      error={detailPageAction.error}
      errorMessage={detailPageAction.errorMessage}
      isDeployDisabled={detailPageAction.isDeployDisabled}
      isDeploying={detailPageAction.isDeploying}
      isError={detailPageAction.isError}
      isLoading={detailPageAction.isLoading}
      onDeployNow={detailPageAction.onDeployNow}
      onRetry={detailPageAction.onRetry}
      project={detailPageAction.project}
    />
  );
}