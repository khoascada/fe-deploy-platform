'use client';

import {
  useCreateDeployment,
  useGetProjectDeployments,
} from '@/features/deployments';
import { useDeleteProject, useGetProjectDetail } from '@/features/projects/hooks';
import type { ProjectDetail } from '@/types/project';
import { useRouter } from '@i18n/navigation';
import { useConfirm, useTranslateError } from '@lib/hooks';
import type { ApiError } from '@lib/types/base';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useProjectDeploymentRealtime } from './use-project-deployment-realtime';

interface UseDetailPageActionOptions {
  projectId: string;
}

const PROJECT_DETAIL_DEPLOYMENTS_LIMIT = 20;

const ACTIVE_DEPLOYMENT_STATUSES: Array<NonNullable<ProjectDetail['latestDeploy']>['status']> = [
  'QUEUED',
  'PULLING',
  'BUILDING',
  'DEPLOYING',
];

export function useDetailPageAction({ projectId }: UseDetailPageActionOptions) {
  const router = useRouter();
  const t = useTranslations('pages.projectDetail');
  const { data, error, isError, isLoading, refetch } = useGetProjectDetail(projectId);
  const deploymentsQuery = useGetProjectDeployments(projectId, PROJECT_DETAIL_DEPLOYMENTS_LIMIT, {
    enabled: Boolean(projectId),
    retry: false,
  });
  const confirm = useConfirm();
  const { getErrorMessage } = useTranslateError();
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);
  const {
    createDeployment,
    error: deploymentError,
    isPending: isDeploying,
    reset: resetCreateDeployment,
  } = useCreateDeployment(projectId);
  const {
    deleteProject,
    error: deleteError,
    isPending: isDeleting,
    reset: resetDeleteProject,
  } = useDeleteProject();

  useProjectDeploymentRealtime({ project: data });

  const deployments = useMemo(() => deploymentsQuery.data ?? [], [deploymentsQuery.data]);
  const preferredDeploymentId = deployments.at(0)?.id ?? data?.latestDeploy?.id ?? null;

  useEffect(() => {
    setSelectedDeploymentId((currentDeploymentId) => {
      if (
        currentDeploymentId &&
        deployments.some((deployment) => deployment.id === currentDeploymentId)
      ) {
        return currentDeploymentId;
      }

      return preferredDeploymentId;
    });
  }, [deployments, preferredDeploymentId]);

  const selectedDeployment = useMemo(() => {
    if (!selectedDeploymentId) {
      return null;
    }

    return deployments.find((deployment) => deployment.id === selectedDeploymentId) ?? null;
  }, [deployments, selectedDeploymentId]);

  const resolvedLogDeploymentId = selectedDeployment?.id ?? selectedDeploymentId ?? data?.latestDeploy?.id;
  const resolvedLogDeploymentStatus = selectedDeployment?.status ?? data?.latestDeploy?.status;

  const handleDeployNow = async () => {
    if (!data || isDeploying) {
      return;
    }

    resetCreateDeployment();

    const isConfirmed = await confirm({
      title: t('confirm.deployTitle', { projectName: data.name }),
      description: t('confirm.deployDescription', { branch: data.deployBranch }),
      confirmText: t('confirm.confirmAction'),
      cancelText: t('confirm.cancelAction'),
    });

    if (!isConfirmed) {
      return;
    }

    try {
      const deployment = await createDeployment();
      setSelectedDeploymentId(deployment.id);
      toast.success(t('toast.deployQueued'));
    } catch {
      // Error state is surfaced through the mutation and rendered in the card.
    }
  };

  const handleDeleteProject = async () => {
    if (!data || isDeleting) {
      return;
    }

    resetDeleteProject();

    const isConfirmed = await confirm({
      title: t('confirm.deleteProjectTitle', { projectName: data.name }),
      description: t('confirm.deleteProjectDescription'),
      confirmText: t('confirm.deleteProjectAction'),
      cancelText: t('confirm.cancelAction'),
      destructive: true,
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteProject(data.id);
      toast.success(t('toast.projectDeleted', { projectName: data.name }));
      router.push('/projects');
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError as ApiError));
    }
  };

  const isDeployDisabled =
    isDeploying ||
    (data?.latestDeploy ? ACTIVE_DEPLOYMENT_STATUSES.includes(data.latestDeploy.status) : false);

  return {
    deleteErrorMessage: deleteError ? getErrorMessage(deleteError) : '',
    deploymentErrorMessage: getErrorMessage(deploymentsQuery.error),
    deployments,
    deployErrorMessage: deploymentError ? getErrorMessage(deploymentError) : '',
    error,
    errorMessage: getErrorMessage(error),
    isDeleteDisabled: isDeleting,
    isDeleting,
    isDeployDisabled,
    isDeploying,
    isDeploymentsError: deploymentsQuery.isError,
    isDeploymentsLoading: deploymentsQuery.isLoading,
    isError,
    isLoading,
    onDeleteProject: () => void handleDeleteProject(),
    onDeployNow: () => void handleDeployNow(),
    onRetry: () => void refetch(),
    onRetryDeployments: () => void deploymentsQuery.refetch(),
    onSelectDeployment: setSelectedDeploymentId,
    project: data,
    resolvedLogDeploymentId,
    resolvedLogDeploymentStatus,
    selectedDeploymentId,
  };
}
