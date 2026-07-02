'use client';

import { useCreateDeployment } from '@/features/deployments/hooks/use-create-deployment';
import { useGetProjectDetail } from '@/features/projects/hooks';
import type { ProjectDetail } from '@/types/project';
import { useConfirm, useTranslateError } from '@lib/hooks';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface UseDetailPageActionOptions {
  projectId: string;
}

const ACTIVE_DEPLOYMENT_STATUSES: Array<NonNullable<ProjectDetail['latestDeploy']>['status']> = [
  'QUEUED',
  'PULLING',
  'BUILDING',
  'DEPLOYING',
];

export function useDetailPageAction({ projectId }: UseDetailPageActionOptions) {
  const t = useTranslations('pages.projectDetail');
  const { data, error, isError, isLoading, refetch } = useGetProjectDetail(projectId);
  const confirm = useConfirm();
  const { getErrorMessage } = useTranslateError();
  const {
    createDeployment,
    error: deploymentError,
    isPending: isDeploying,
    reset: resetCreateDeployment,
  } = useCreateDeployment(projectId);

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
      await createDeployment();
      toast.success(t('toast.deployQueued'));
    } catch {
      // Error state is surfaced through the mutation and rendered in the card.
    }
  };

  const isDeployDisabled =
    isDeploying ||
    (data?.latestDeploy ? ACTIVE_DEPLOYMENT_STATUSES.includes(data.latestDeploy.status) : false);

  return {
    deployErrorMessage: deploymentError ? getErrorMessage(deploymentError) : '',
    error,
    errorMessage: getErrorMessage(error),
    isDeployDisabled,
    isDeploying,
    isError,
    isLoading,
    onDeployNow: () => void handleDeployNow(),
    onRetry: () => void refetch(),
    project: data,
  };
}
