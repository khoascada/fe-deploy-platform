'use client';

import { useNewProjectPage } from '@/features/projects/hooks';
import { NewProjectPageView } from './new-project-page-view';

export function NewProjectPageClient() {
  const newProjectPage = useNewProjectPage();

  return (
    <NewProjectPageView
      branchSearch={newProjectPage.branchSearch}
      branchesErrorMessage={newProjectPage.branchesErrorMessage}
      filteredBranchOptions={newProjectPage.filteredBranchOptions}
      filteredRepositoryOptions={newProjectPage.filteredRepositoryOptions}
      findRepositoryOptionById={newProjectPage.findRepositoryOptionById}
      isBranchesError={newProjectPage.isBranchesError}
      isBranchesLoading={newProjectPage.isBranchesLoading}
      isRefreshingBranches={newProjectPage.isRefreshingBranches}
      isRepositoriesError={newProjectPage.isRepositoriesError}
      isRepositoriesLoading={newProjectPage.isRepositoriesLoading}
      isRefreshingRepositories={newProjectPage.isRefreshingRepositories}
      isSubmitting={newProjectPage.isSubmitting}
      onBranchSearchChange={newProjectPage.onBranchSearchChange}
      onRefreshBranches={newProjectPage.onRefreshBranches}
      onRefreshRepositories={newProjectPage.onRefreshRepositories}
      onRepositorySearchChange={newProjectPage.onRepositorySearchChange}
      onRetryRepositories={newProjectPage.onRetryRepositories}
      onSelectRepository={newProjectPage.onSelectRepository}
      onSubmit={newProjectPage.onSubmit}
      repositoriesErrorMessage={newProjectPage.repositoriesErrorMessage}
      repositorySearch={newProjectPage.repositorySearch}
      submitErrorMessage={newProjectPage.submitErrorMessage}
    />
  );
}
