'use client';

import { useProjectsPage } from '@/features/projects/hooks';
import { ProjectsPageView } from './projects-page-view';

export function ProjectsPageClient() {
  const projectsPage = useProjectsPage();

  return (
    <ProjectsPageView
      currentPage={projectsPage.currentPage}
      errorMessage={projectsPage.errorMessage}
      hasSearchQuery={projectsPage.hasSearchQuery}
      isError={projectsPage.isError}
      isLoading={projectsPage.isLoading}
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
