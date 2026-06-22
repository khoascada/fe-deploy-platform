import * as React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@lib/test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import enMessages from '../../../messages/en.json';
import { NewProjectPageView } from './new-project-page-view';

vi.mock('@i18n/navigation', () => ({
  Link: ({ children, href, ...props }: React.ComponentProps<'a'>) => (
    <a href={typeof href === 'string' ? href : '#'} {...props}>
      {children}
    </a>
  ),
}));

describe('NewProjectPageView', () => {
  const repositoryOptions = [
    {
      value: '101',
      label: 'acme/web-app',
      repository: {
        id: '101',
        name: 'web-app',
        fullName: 'acme/web-app',
        private: false,
        defaultBranch: 'main',
        url: 'https://github.com/acme/web-app',
        owner: {
          login: 'acme',
          avatarUrl: 'https://avatars.githubusercontent.com/u/101',
        },
      },
    },
  ];

  const branchOptions = [
    {
      value: 'main',
      label: 'main',
      branch: {
        name: 'main',
        protected: false,
        commit: {
          sha: 'abc123',
          url: 'https://api.github.com/repos/acme/web-app/commits/abc123',
        },
      },
    },
  ];

  function TestHarness({ onSubmit }: { onSubmit: (values: unknown) => Promise<void> }) {
    const [repositorySearch, setRepositorySearch] = React.useState('');
    const [branchSearch, setBranchSearch] = React.useState('');

    return (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <NewProjectPageView
          branchSearch={branchSearch}
          branchesErrorMessage=""
          filteredBranchOptions={branchOptions.filter((option) =>
            option.label.toLowerCase().includes(branchSearch.toLowerCase())
          )}
          filteredRepositoryOptions={repositoryOptions.filter((option) =>
            option.label.toLowerCase().includes(repositorySearch.toLowerCase())
          )}
          findRepositoryOptionById={(repositoryId) =>
            repositoryOptions.find((option) => option.value === repositoryId) ?? null
          }
          isBranchesError={false}
          isBranchesLoading={false}
          isRefreshingBranches={false}
          isRepositoriesError={false}
          isRepositoriesLoading={false}
          isRefreshingRepositories={false}
          isSubmitting={false}
          onBranchSearchChange={setBranchSearch}
          onRefreshBranches={() => {}}
          onRefreshRepositories={() => {}}
          onRepositorySearchChange={setRepositorySearch}
          onRetryRepositories={() => {}}
          onSelectRepository={(repositoryId) =>
            repositoryOptions.find((option) => option.value === repositoryId) ?? null
          }
          onSubmit={onSubmit}
          repositoriesErrorMessage=""
          repositorySearch={repositorySearch}
          submitErrorMessage=""
        />
      </NextIntlClientProvider>
    );
  }

  it('prefills repository-driven fields and submits normalized values', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TestHarness onSubmit={handleSubmit} />);

    const repositoryInput = screen.getByRole('combobox');
    await user.click(repositoryInput);
    await user.type(repositoryInput, 'acme/web');
    await user.click(screen.getByText('acme/web-app'));

    await waitFor(() => {
      expect(screen.getByLabelText('Project name')).toHaveValue('web-app');
      expect(screen.getByLabelText('Deploy branch')).toHaveValue('main');
    });

    await user.click(screen.getByRole('button', { name: 'Create project' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        githubRepoId: '101',
        name: 'web-app',
        deployBranch: 'main',
        rootDirectory: undefined,
        dockerfilePath: undefined,
        buildContext: undefined,
        containerPort: undefined,
        hostPort: null,
        autoDeploy: false,
      });
    });
  });
});

