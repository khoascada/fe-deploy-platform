'use client';

import {
  useCreateProject,
  useGetGithubBranches,
  useGetGithubRepos,
} from '@/features/projects/hooks/actions';
import type { CreateProjectFormValues } from '@/features/projects/validations';
import { useRouter } from '@i18n/navigation';
import { getApiErrorMessage } from '@lib/utils/error';
import { githubApi } from '@services/github.service';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

export function useNewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [repositorySearch, setRepositorySearch] = useState('');
  const [branchSearch, setBranchSearch] = useState('');
  const [selectedRepositoryOwner, setSelectedRepositoryOwner] = useState('');
  const [selectedRepositoryName, setSelectedRepositoryName] = useState('');
  const [selectedRepositoryId, setSelectedRepositoryId] = useState('');
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

  const selectedRepositoryOption = useMemo(
    () => findRepositoryOptionById(selectedRepositoryId),
    [findRepositoryOptionById, selectedRepositoryId]
  );

  const handleSelectRepository = useCallback(
    (repositoryId: string) => {
      const selectedOption = repositoryOptions.find((option) => option.value === repositoryId) ?? null;

      setSelectedRepositoryId(repositoryId);
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
      queryClient.setQueryData(['github', 'repos'], repositories);
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
        ['github', 'repos', selectedRepositoryOwner, selectedRepositoryName, 'branches'],
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
      if (!selectedRepositoryOption) {
        throw new Error('Selected repository is missing');
      }

      const { repository } = selectedRepositoryOption;

      await createProject({
        githubRepoId: values.githubRepoId,
        repoFullName: repository.fullName,
        repoOwner: repository.owner.login,
        repoName: repository.name,
        repoUrl: repository.url,
        githubDefaultBranch: repository.defaultBranch,
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
    [createProject, router, selectedRepositoryOption]
  );

  return {
    branchSearch,
    branchesErrorMessage:
      refreshBranchesErrorMessage || (branchesError ? getApiErrorMessage(branchesError) : ''),
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
      (repositoriesError ? getApiErrorMessage(repositoriesError) : ''),
    repositorySearch,
    submitErrorMessage: submitError ? getApiErrorMessage(submitError) : '',
  };
}
