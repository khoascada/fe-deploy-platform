'use client';

import {
  useCreateEnvVar,
  useDeleteEnvVar,
  useGetProjectEnvVars,
  useUpdateEnvVar,
} from '@/features/env-vars/hooks';
import type { EnvVar } from '@/types/env-var';
import { useConfirm, useTranslateError } from '@lib/hooks';
import type { ApiError } from '@lib/types/base';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseEnvironmentVariablesCardOptions {
  projectId: string;
}

export function useEnvironmentVariablesCard({
  projectId,
}: UseEnvironmentVariablesCardOptions) {
  const t = useTranslations('pages.projectDetail.envVars');
  const confirm = useConfirm();
  const { getErrorMessage } = useTranslateError();
  const { data, error, isError, isLoading, refetch } = useGetProjectEnvVars(projectId);
  const createMutation = useCreateEnvVar(projectId);
  const updateMutation = useUpdateEnvVar(projectId);
  const deleteMutation = useDeleteEnvVar(projectId);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);
  const [selectedEnvVar, setSelectedEnvVar] = useState<EnvVar | null>(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const [busyEnvVarId, setBusyEnvVarId] = useState<string | null>(null);

  const openCreateDialog = () => {
    setSubmitErrorMessage('');
    setSelectedEnvVar(null);
    setDialogMode('create');
  };

  const openEditDialog = (envVar: EnvVar) => {
    setSubmitErrorMessage('');
    setSelectedEnvVar(envVar);
    setDialogMode('edit');
  };

  const closeDialog = (isOpen: boolean) => {
    if (isOpen) {
      return;
    }

    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setDialogMode(null);
    setSelectedEnvVar(null);
    setSubmitErrorMessage('');
  };

  const handleCreate = async (
    payload: Parameters<typeof createMutation.createEnvVar>[0],
  ) => {
    setSubmitErrorMessage('');

    try {
      await createMutation.createEnvVar(payload);
      toast.success(t('toast.created'));
      setDialogMode(null);
    } catch (mutationError) {
      setSubmitErrorMessage(getErrorMessage(mutationError as ApiError));
    }
  };

  const handleUpdate = async (
    envVarId: string,
    payload: Parameters<typeof updateMutation.updateEnvVar>[1],
  ) => {
    setSubmitErrorMessage('');

    try {
      await updateMutation.updateEnvVar(envVarId, payload);
      toast.success(t('toast.updated'));
      setDialogMode(null);
      setSelectedEnvVar(null);
    } catch (mutationError) {
      setSubmitErrorMessage(getErrorMessage(mutationError as ApiError));
    }
  };

  const handleToggle = async (envVar: EnvVar, isEnabled: boolean) => {
    setBusyEnvVarId(envVar.id);

    try {
      await updateMutation.updateEnvVar(envVar.id, { isEnabled });
      toast.success(
        isEnabled
          ? t('toast.enabled', { key: envVar.key })
          : t('toast.disabled', { key: envVar.key }),
      );
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError as ApiError));
    } finally {
      setBusyEnvVarId(null);
    }
  };

  const handleDelete = async (envVar: EnvVar) => {
    const isConfirmed = await confirm({
      title: t('confirm.deleteTitle', { key: envVar.key }),
      description: t('confirm.deleteDescription'),
      confirmText: t('confirm.deleteAction'),
      cancelText: t('confirm.cancelAction'),
      destructive: true,
    });

    if (!isConfirmed) {
      return;
    }

    setBusyEnvVarId(envVar.id);

    try {
      await deleteMutation.deleteEnvVar(envVar.id);
      toast.success(t('toast.deleted', { key: envVar.key }));
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError as ApiError));
    } finally {
      setBusyEnvVarId(null);
    }
  };

  return {
    activeEnvVar: selectedEnvVar,
    busyEnvVarId,
    envVars: data ?? [],
    envVarsErrorMessage: isError ? getErrorMessage(error) : '',
    isCreateDialogOpen: dialogMode === 'create',
    isDialogSubmitting: createMutation.isPending || updateMutation.isPending,
    isEditDialogOpen: dialogMode === 'edit',
    isError,
    isLoading,
    onCreate: handleCreate,
    onDelete: handleDelete,
    onOpenChange: closeDialog,
    onOpenCreateDialog: openCreateDialog,
    onOpenEditDialog: openEditDialog,
    onRetry: () => void refetch(),
    onToggle: handleToggle,
    onUpdate: handleUpdate,
    submitErrorMessage,
  };
}