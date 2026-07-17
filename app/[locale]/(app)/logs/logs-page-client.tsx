'use client';

import { useLogsPage } from './use-logs-page';
import { LogsPageView } from './logs-page-view';

export function LogsPageClient() {
  const logsPage = useLogsPage();

  return (
    <LogsPageView
      deploymentErrorMessage={logsPage.deploymentErrorMessage}
      deployments={logsPage.deployments}
      hasSearchQuery={logsPage.hasSearchQuery}
      isDeploymentsError={logsPage.isDeploymentsError}
      isDeploymentsLoading={logsPage.isDeploymentsLoading}
      isLogsError={logsPage.isLogsError}
      isLogsLoading={logsPage.isLogsLoading}
      isProjectsError={logsPage.isProjectsError}
      isProjectsLoading={logsPage.isProjectsLoading}
      logs={logsPage.logs}
      logsErrorMessage={logsPage.logsErrorMessage}
      onDeploymentChange={logsPage.onDeploymentChange}
      onProjectChange={logsPage.onProjectChange}
      onRetryDeployments={logsPage.onRetryDeployments}
      onRetryProjects={logsPage.onRetryProjects}
      onSearchChange={logsPage.onSearchChange}
      projectErrorMessage={logsPage.projectErrorMessage}
      projects={logsPage.projects}
      searchQuery={logsPage.searchQuery}
      selectedDeployment={logsPage.selectedDeployment}
      selectedProject={logsPage.selectedProject}
    />
  );
}
