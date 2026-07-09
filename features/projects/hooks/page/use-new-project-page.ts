'use client';

import {
  useCreateProject,
  useGetGithubBranches,
  useGetGithubRepos,
} from '@/features/projects/hooks/actions';
import type { CreateProjectFormValues } from '@/features/projects/validations';
import { useTranslateError } from '@/lib/hooks';
import { useRouter } from '@i18n/navigation';
import { getApiErrorMessage } from '@lib/utils/error';
import { githubApi } from '@services/github.service';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

export function useNewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getErrorMessage } = useTranslateError();
  const [repositorySearch, setRepositorySearch] = useState('');
  const [branchSearch, setBranchSearch] = useState('');
  const [selectedRepositoryOwner, setSelectedRepositoryOwner] = useState('');
  const [selectedRepositoryName, setSelectedRepositoryName] = useState('');
  const [refreshRepositoriesErrorMessage, setRefreshRepositoriesErrorMessage] = useState('');
  const [refreshBranchesErrorMessage, setRefreshBranchesErrorMessage] = useState('');
  const [isRefreshingRepositories, setIsRefreshingRepositories] = useState(false);
  const [isRefreshingBranches, setIsRefreshingBranches] = useState(false);

  const {
    data: repositoryOptions = [],
    error: repositoriesError,
    isError: isRepositoriesError,
    isLoading: isRepositoriesLoading,
    refetch: refetchRepositories,
  } = useGetGithubRepos();
  const {
    data: branchOptions = [],
    error: branchesError,
    isError: isBranchesError,
    isLoading: isBranchesLoading,
  } = useGetGithubBranches(selectedRepositoryOwner, selectedRepositoryName);
  const { createProject, error: submitError, isPending: isSubmitting } = useCreateProject();

  const filteredRepositoryOptions = useMemo(() => {
    const query = repositorySearch.trim().toLowerCase();

    if (!query) {
      return repositoryOptions;
    }

    return repositoryOptions.filter(({ label, repository }) =>
      [label, repository.name, repository.owner.login, repository.defaultBranch]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [repositoryOptions, repositorySearch]);

  const filteredBranchOptions = useMemo(() => {
    const query = branchSearch.trim().toLowerCase();

    if (!query) {
      return branchOptions;
    }

    return branchOptions.filter(({ label }) => label.toLowerCase().includes(query));
  }, [branchOptions, branchSearch]);

  const findRepositoryOptionById = useCallback(
    (repositoryId: string) =>
      repositoryOptions.find((option) => option.value === repositoryId) ?? null,
    [repositoryOptions]
  );

  const handleSelectRepository = useCallback(
    (repositoryId: string) => {
      const selectedOption =
        repositoryOptions.find((option) => option.value === repositoryId) ?? null;

      setSelectedRepositoryOwner(selectedOption?.repository.owner.login ?? '');
      setSelectedRepositoryName(selectedOption?.repository.name ?? '');
      setBranchSearch(selectedOption?.repository.defaultBranch ?? '');
      setRefreshBranchesErrorMessage('');

      return selectedOption;
    },
    [repositoryOptions]
  );

  const handleRefreshRepositories = useCallback(async () => {
    setIsRefreshingRepositories(true);
    setRefreshRepositoriesErrorMessage('');

    try {
      const repositories = await githubApi.getListRepos(true);
      queryClient.setQueryData(['github-repos'], repositories);
    } catch (error) {
      setRefreshRepositoriesErrorMessage(getApiErrorMessage(error as never));
    } finally {
      setIsRefreshingRepositories(false);
    }
  }, [queryClient]);

  const handleRefreshBranches = useCallback(async () => {
    if (!selectedRepositoryOwner || !selectedRepositoryName) {
      return;
    }

    setIsRefreshingBranches(true);
    setRefreshBranchesErrorMessage('');

    try {
      const branches = await githubApi.getListBranches(
        selectedRepositoryOwner,
        selectedRepositoryName,
        true
      );

      queryClient.setQueryData(
        ['github-repos-branches', selectedRepositoryOwner, selectedRepositoryName],
        branches
      );
    } catch (error) {
      setRefreshBranchesErrorMessage(getApiErrorMessage(error as never));
    } finally {
      setIsRefreshingBranches(false);
    }
  }, [queryClient, selectedRepositoryName, selectedRepositoryOwner]);

  const submit = useCallback(
    async (values: CreateProjectFormValues) => {
      await createProject({
        githubRepoId: values.githubRepoId,
        name: values.name,
        deployBranch: values.deployBranch,
        rootDirectory: values.rootDirectory,
        dockerfilePath: values.dockerfilePath,
        buildContext: values.buildContext,
        containerPort: values.containerPort,
        hostPort: values.hostPort,
        autoDeploy: values.autoDeploy,
      });

      router.replace('/projects');
    },
    [createProject, router]
  );

  return {
    branchSearch,
    branchesErrorMessage:
      refreshBranchesErrorMessage || (branchesError ? getErrorMessage(branchesError) : ''),
    filteredBranchOptions,
    filteredRepositoryOptions,
    findRepositoryOptionById,
    isBranchesError: Boolean(refreshBranchesErrorMessage) || isBranchesError,
    isBranchesLoading,
    isRefreshingBranches,
    isRepositoriesError,
    isRepositoriesLoading,
    isRefreshingRepositories,
    isSubmitting,
    onBranchSearchChange: setBranchSearch,
    onRefreshBranches: handleRefreshBranches,
    onRefreshRepositories: handleRefreshRepositories,
    onRepositorySearchChange: setRepositorySearch,
    onRetryRepositories: () => void refetchRepositories(),
    onSelectRepository: handleSelectRepository,
    onSubmit: submit,
    repositoriesErrorMessage:
      refreshRepositoriesErrorMessage ||
      (repositoriesError ? getErrorMessage(repositoriesError) : ''),
    repositorySearch,
    submitErrorMessage: submitError ? getErrorMessage(submitError) : '',
  };
}
