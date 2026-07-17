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
      deleteErrorMessage={detailPageAction.deleteErrorMessage}
      deploymentErrorMessage={detailPageAction.deploymentErrorMessage}
      deployments={detailPageAction.deployments}
      deployErrorMessage={detailPageAction.deployErrorMessage}
      error={detailPageAction.error}
      errorMessage={detailPageAction.errorMessage}
      isDeleting={detailPageAction.isDeleting}
      isDeployDisabled={detailPageAction.isDeployDisabled}
      isDeploying={detailPageAction.isDeploying}
      isDeploymentsError={detailPageAction.isDeploymentsError}
      isDeploymentsLoading={detailPageAction.isDeploymentsLoading}
      isError={detailPageAction.isError}
      isLoading={detailPageAction.isLoading}
      onDeleteProject={detailPageAction.onDeleteProject}
      onDeployNow={detailPageAction.onDeployNow}
      onRetry={detailPageAction.onRetry}
      onRetryDeployments={detailPageAction.onRetryDeployments}
      onSelectDeployment={detailPageAction.onSelectDeployment}
      project={detailPageAction.project}
      resolvedLogDeploymentId={detailPageAction.resolvedLogDeploymentId}
      resolvedLogDeploymentStatus={detailPageAction.resolvedLogDeploymentStatus}
      selectedDeploymentId={detailPageAction.selectedDeploymentId}
    />
  );
}
