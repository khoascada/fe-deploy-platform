'use client';

import { useProjectsPage } from '@/features/projects/hooks';
import { ProjectsPageView } from './projects-page-view';

export function ProjectsPageClient() {
  const projectsPage = useProjectsPage();

  return (
    <ProjectsPageView
      canCreateProject={projectsPage.canCreateProject}
      currentPage={projectsPage.currentPage}
      errorMessage={projectsPage.errorMessage}
      githubConnected={projectsPage.githubConnected}
      githubConnectReason={projectsPage.githubConnectReason}
      githubConnectStatus={projectsPage.githubConnectStatus}
      hasSearchQuery={projectsPage.hasSearchQuery}
      isError={projectsPage.isError}
      isLoading={projectsPage.isLoading}
      onConnectGithub={projectsPage.onConnectGithub}
      onDismissGithubConnectStatus={projectsPage.onDismissGithubConnectStatus}
      onPageChange={projectsPage.onPageChange}
      onRetry={projectsPage.onRetry}
      onSearchChange={projectsPage.onSearchChange}
      onViewModeChange={projectsPage.onViewModeChange}
      projects={projectsPage.filteredProjects}
      searchQuery={projectsPage.searchQuery}
      totalPages={projectsPage.totalPages}
      totalProjects={projectsPage.totalProjects}
      viewMode={projectsPage.viewMode}
    />
  );
}
