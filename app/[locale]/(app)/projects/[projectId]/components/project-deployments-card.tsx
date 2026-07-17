'use client';

import type { DeployListItem } from '@/types/project';
import { Button, Card, CardContent, Skeleton } from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate } from '@lib/utils/date';
import { AlertCircle, Clock3, GitBranch, GitCommitHorizontal, History } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getCommitShortSha, getDeployStatusTone, StatusBadge } from './project-detail-utils';

interface ProjectDeploymentsCardProps {
  deploymentErrorMessage: string;
  deployments: DeployListItem[];
  isDeploymentsError: boolean;
  isDeploymentsLoading: boolean;
  isSelectionDisabled: boolean;
  onRetryDeployments: () => void;
  onSelectDeployment: (deploymentId: string) => void;
  selectedDeploymentId?: string | null;
}

function DeploymentListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-busy="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="rounded-2xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-4 w-2/3" />
          <Skeleton className="mt-3 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ProjectDeploymentsCard({
  deploymentErrorMessage,
  deployments,
  isDeploymentsError,
  isDeploymentsLoading,
  isSelectionDisabled,
  onRetryDeployments,
  onSelectDeployment,
  selectedDeploymentId,
}: ProjectDeploymentsCardProps) {
  const t = useTranslations('pages.logs.deployments');
  const projectDetailT = useTranslations('pages.projectDetail');
  const commonLogsT = useTranslations('pages.logs');
  const locale = useLocale();

  return (
    <Card className="border-border/70 overflow-hidden rounded-3xl">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="text-muted-foreground size-4" />
            <h2 className="text-lg font-semibold">{t('title')}</h2>
          </div>
          {deployments.length > 0 ? (
            <span className="text-muted-foreground text-xs font-medium">{deployments.length}</span>
          ) : null}
        </div>

        <div className="max-h-[34rem] space-y-2 overflow-auto pr-1">
          {isDeploymentsLoading ? (
            <DeploymentListSkeleton />
          ) : isDeploymentsError ? (
            <div className="space-y-3 rounded-2xl border px-4 py-6 text-center" role="alert">
              <AlertCircle className="text-destructive mx-auto size-5" />
              <div className="space-y-1">
                <p className="font-semibold">{t('errorTitle')}</p>
                <p className="text-muted-foreground text-sm">
                  {deploymentErrorMessage || t('errorDescription')}
                </p>
              </div>
              <Button onClick={onRetryDeployments} size="sm">
                {commonLogsT('retry')}
              </Button>
            </div>
          ) : deployments.length === 0 ? (
            <div className="space-y-1 rounded-2xl border px-4 py-6 text-center" role="status">
              <p className="font-semibold">{t('emptyTitle')}</p>
              <p className="text-muted-foreground text-sm">{t('emptyDescription')}</p>
            </div>
          ) : (
            deployments.map((deployment) => {
              const isSelected = deployment.id === selectedDeploymentId;

              return (
                <button
                  key={deployment.id}
                  aria-pressed={isSelected}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40',
                    isSelectionDisabled && !isSelected ? 'hover:bg-transparent' : ''
                  )}
                  disabled={isSelectionDisabled}
                  onClick={() => onSelectDeployment(deployment.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold">#{deployment.deploymentNumber}</p>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <GitBranch className="size-3.5" />
                          {deployment.branch}
                        </span>
                        {deployment.commitSha ? (
                          <span className="inline-flex items-center gap-1 font-mono">
                            <GitCommitHorizontal className="size-3.5" />
                            {getCommitShortSha(deployment.commitSha)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <StatusBadge tone={getDeployStatusTone(deployment.status)}>
                      {projectDetailT(`status.${deployment.status}`)}
                    </StatusBadge>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6">
                    {deployment.commitMessage || t('noCommitMessage')}
                  </p>

                  <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5" />
                      {formatDate(deployment.createdAt, { locale, showTime: true })}
                    </span>
                    <span>{projectDetailT(`trigger.${deployment.trigger}`)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
