'use client';

import type { ProjectDetail } from '@/types/project';
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from '@components/ui';
import {
  AlertCircle,
  ArrowUpRight,
  Clock3,
  GitCommitHorizontal,
  Loader2,
  LoaderCircle,
  Rocket,
  TimerReset,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  getCommitShortSha,
  getDeployFinishedLabel,
  getDeployRelativeLabel,
  getDeployStatusTone,
  renderStatusIcon,
  StatusBadge,
} from './project-detail-utils';

interface DeploymentStatusCardProps {
  deployErrorMessage: string;
  isDeployDisabled: boolean;
  isDeploying: boolean;
  onDeployNow: () => void;
  project: ProjectDetail;
}

function getProgressValue(status: NonNullable<ProjectDetail['latestDeploy']>['status']) {
  switch (status) {
    case 'QUEUED':
      return 12;
    case 'PULLING':
      return 28;
    case 'BUILDING':
      return 56;
    case 'DEPLOYING':
      return 82;
    case 'SUCCESS':
      return 100;
    case 'FAILED':
    case 'CANCELED':
      return 100;
    default:
      return 0;
  }
}

function DeploymentErrorNotice({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}

export function DeploymentStatusCard({
  deployErrorMessage,
  isDeployDisabled,
  isDeploying,
  onDeployNow,
  project,
}: DeploymentStatusCardProps) {
  const t = useTranslations('pages.projectDetail');
  const locale = useLocale();
  const latestDeploy = project.latestDeploy;

  if (!latestDeploy) {
    return (
      <Card className="overflow-hidden rounded-3xl border-border/70">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle className="text-lg">{t('deploymentStatus.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="rounded-2xl border border-dashed from-muted/60 to-background p-6">
            <div className="space-y-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Rocket className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold">{t('deploymentStatus.emptyTitle')}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t('deploymentStatus.emptyDescription')}
                </p>
              </div>
              <DeploymentErrorNotice message={deployErrorMessage} />
              <Button
                className="w-full sm:w-auto"
                disabled={isDeployDisabled}
                onClick={onDeployNow}
              >
                {isDeploying ? <Loader2 className="size-4 animate-spin" /> : null}
                {t('deploymentStatus.primaryAction')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const finishedLabel = getDeployFinishedLabel(latestDeploy, locale);

  return (
    <Card className="overflow-hidden rounded-3xl border-border/70">
      <CardHeader className="border-b border-border/60 pb-5">
        <div className="flex gap-4 items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{t('deploymentStatus.eyebrow')}</CardTitle>
          </div>
          <StatusBadge tone={getDeployStatusTone(latestDeploy.status)} className="self-start">
            {t(`status.${latestDeploy.status}`)}
          </StatusBadge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="rounded-2xl border from-background to-muted/30 p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {renderStatusIcon(latestDeploy.status, 'size-5')}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold">{t(`status.${latestDeploy.status}`)}</p>
                    <StatusBadge tone={getDeployStatusTone(latestDeploy.status)} className="capitalize">
                      {t(`trigger.${latestDeploy.trigger}`)}
                    </StatusBadge>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {latestDeploy.commitMessage || t('deploymentStatus.noCommitMessage')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-xs uppercase text-muted-foreground">
                    {t('deploymentStatus.metrics.commit')}
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold">
                    {latestDeploy.commitSha ? getCommitShortSha(latestDeploy.commitSha) : '--'}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-xs uppercase text-muted-foreground">
                    {t('deploymentStatus.metrics.started')}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {getDeployRelativeLabel(latestDeploy, locale)}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-xs uppercase text-muted-foreground">
                    {t('deploymentStatus.metrics.finished')}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {finishedLabel || t('deploymentStatus.inProgress')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{t('deploymentStatus.progressLabel')}</span>
                <span className="font-medium">{getProgressValue(latestDeploy.status)}%</span>
              </div>
              <Progress value={getProgressValue(latestDeploy.status)} />
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              <GitCommitHorizontal className="size-4" />
              {t('deploymentStatus.cards.commit.title')}
            </div>
            <p className="mt-3 text-sm font-medium leading-6">
              {latestDeploy.commitMessage || t('deploymentStatus.noCommitMessage')}
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              <Clock3 className="size-4" />
              {t('deploymentStatus.cards.started.title')}
            </div>
            <p className="mt-3 text-sm font-medium leading-6">
              {getDeployRelativeLabel(latestDeploy, locale)}
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              {finishedLabel ? <TimerReset className="size-4" /> : <LoaderCircle className="size-4" />}
              {t('deploymentStatus.cards.action.title')}
            </div>
            <p className="mt-3 text-sm font-medium leading-6">
              {finishedLabel || t('deploymentStatus.cards.action.pending')}
            </p>
          </div>
        </div>

        <DeploymentErrorNotice message={deployErrorMessage} />

        <div className="flex flex-wrap gap-3">
          <Button disabled={isDeployDisabled} onClick={onDeployNow}>
            {isDeploying ? <Loader2 className="size-4 animate-spin" /> : null}
            {t('deploymentStatus.primaryAction')}
          </Button>
          <Button variant="outline" disabled>
            {t('deploymentStatus.secondaryAction')}
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}