'use client';

import type { EnvVar } from '@/types/env-var';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Switch,
} from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate } from '@lib/utils/date';
import { EyeOff, Pencil, Plus, RefreshCw, ShieldAlert, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEnvironmentVariablesCard } from '../hooks/use-environment-variables-card';
import { EnvVarDialog } from './env-var-dialog';

interface EnvironmentVariablesCardProps {
  projectId: string;
}

function ScopeBadge({ scope }: { scope: EnvVar['scope'] }) {
  const t = useTranslations('pages.projectDetail.envVars');

  return (
    <Badge variant="outline" className="border-border/70 bg-background">
      {scope === 'RUNTIME'
        ? t('scope.runtime')
        : scope === 'BUILD'
          ? t('scope.build')
          : t('scope.both')}
    </Badge>
  );
}

export function EnvironmentVariablesCard({ projectId }: EnvironmentVariablesCardProps) {
  const t = useTranslations('pages.projectDetail.envVars');
  const locale = useLocale();
  const {
    activeEnvVar,
    busyEnvVarId,
    envVars,
    envVarsErrorMessage,
    isCreateDialogOpen,
    isDialogSubmitting,
    isEditDialogOpen,
    isError,
    isLoading,
    onCreate,
    onDelete,
    onOpenChange,
    onOpenCreateDialog,
    onOpenEditDialog,
    onRetry,
    onToggle,
    onUpdate,
    submitErrorMessage,
  } = useEnvironmentVariablesCard({ projectId });

  return (
    <>
      <Card className="border-border/70 rounded-3xl">
        <CardHeader className="border-border/60 border-b pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl uppercase">{t('eyebrow')}</CardTitle>
              <p className="text-muted-foreground text-sm leading-6">{t('description')}</p>
            </div>
            <Button onClick={onOpenCreateDialog} className="w-full sm:w-auto">
              <Plus className="size-4" />
              {t('actions.add')}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6" aria-busy="true" role="status">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-3 rounded-2xl border p-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div
              className="flex min-h-[22rem] flex-col items-center justify-center gap-4 p-6 text-center"
              role="alert"
            >
              <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-2xl">
                <ShieldAlert className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{t('states.errorTitle')}</p>
                <p className="text-muted-foreground text-sm">
                  {envVarsErrorMessage || t('states.errorDescription')}
                </p>
              </div>
              <Button variant="outline" onClick={onRetry}>
                <RefreshCw className="size-4" />
                {t('actions.retry')}
              </Button>
            </div>
          ) : envVars.length === 0 ? (
            <div
              className="flex min-h-[22rem] flex-col items-center justify-center gap-4 p-6 text-center"
              role="status"
            >
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
                <EyeOff className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{t('states.emptyTitle')}</p>
                <p className="text-muted-foreground max-w-md text-sm">
                  {t('states.emptyDescription')}
                </p>
              </div>
              <Button onClick={onOpenCreateDialog}>
                <Plus className="size-4" />
                {t('actions.add')}
              </Button>
            </div>
          ) : (
            <div className="divide-border/70 divide-y">
              {envVars.map((envVar) => {
                const isBusy = busyEnvVarId === envVar.id;

                return (
                  <div key={envVar.id} className="space-y-4 px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-mono text-sm font-semibold break-all">{envVar.key}</p>
                          <ScopeBadge scope={envVar.scope} />
                          <Badge
                            variant={envVar.isEnabled ? 'default' : 'outline'}
                            className={cn(!envVar.isEnabled && 'text-muted-foreground')}
                          >
                            {envVar.isEnabled ? t('status.enabled') : t('status.disabled')}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-mono tracking-[0.24em]">*****************</span>
                          <span>{t('maskedValue')}</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {t('row.updatedAt', {
                            date: formatDate(envVar.updatedAt, { locale, showTime: true }),
                          })}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="border-border/70 bg-muted/30 flex items-center gap-3 rounded-full border px-3 py-2">
                          <span className="text-muted-foreground text-xs font-medium">
                            {envVar.isEnabled ? t('actions.disable') : t('actions.enable')}
                          </span>
                          <Switch
                            checked={envVar.isEnabled}
                            disabled={isBusy}
                            onCheckedChange={(checked) => void onToggle(envVar, checked)}
                            aria-label={t('actions.toggle', { key: envVar.key })}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenEditDialog(envVar)}
                          disabled={isBusy}
                        >
                          <Pencil className="size-4" />
                          {t('actions.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          color="destructive"
                          size="sm"
                          onClick={() => void onDelete(envVar)}
                          disabled={isBusy}
                        >
                          <Trash2 className="size-4" />
                          {t('actions.delete')}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <EnvVarDialog
        isOpen={isCreateDialogOpen}
        isPending={isDialogSubmitting}
        mode="create"
        onOpenChange={onOpenChange}
        onSubmit={async (payload) => onCreate(payload as Parameters<typeof onCreate>[0])}
        submitErrorMessage={submitErrorMessage}
      />

      <EnvVarDialog
        envVar={activeEnvVar}
        isOpen={isEditDialogOpen}
        isPending={isDialogSubmitting}
        mode="edit"
        onOpenChange={onOpenChange}
        onSubmit={async (payload) => {
          if (!activeEnvVar) {
            return;
          }

          await onUpdate(activeEnvVar.id, payload as Parameters<typeof onUpdate>[1]);
        }}
        submitErrorMessage={submitErrorMessage}
      />
    </>
  );
}
