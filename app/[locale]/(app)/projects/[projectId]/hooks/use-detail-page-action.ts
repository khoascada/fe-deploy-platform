'use client';

import { useCreateDeployment } from '@/features/deployments/hooks/use-create-deployment';
import { useDeleteProject, useGetProjectDetail } from '@/features/projects/hooks';
import type { ProjectDetail } from '@/types/project';
import { useRouter } from '@i18n/navigation';
import { useConfirm, useTranslateError } from '@lib/hooks';
import type { ApiError } from '@lib/types/base';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useProjectDeploymentRealtime } from './use-project-deployment-realtime';

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
  const router = useRouter();
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
  const {
    deleteProject,
    error: deleteError,
    isPending: isDeleting,
    reset: resetDeleteProject,
  } = useDeleteProject();

  useProjectDeploymentRealtime({ project: data });

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
    deployErrorMessage: deploymentError ? getErrorMessage(deploymentError) : '',
    error,
    errorMessage: getErrorMessage(error),
    isDeleteDisabled: isDeleting,
    isDeleting,
    isDeployDisabled,
    isDeploying,
    isError,
    isLoading,
    onDeleteProject: () => void handleDeleteProject(),
    onDeployNow: () => void handleDeployNow(),
    onRetry: () => void refetch(),
    project: data,
  };
}
