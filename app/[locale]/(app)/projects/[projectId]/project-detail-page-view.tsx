'use client';

import type { ProjectDetail } from '@/types/project';
import { Button, Card, CardContent } from '@components/ui';
import NotFoundPage from '@components/status-page/not-found';
import { Link } from '@i18n/navigation';
import type { ApiError } from '@lib/types/base';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DeploymentStatusCard } from './components/deployment-status-card';
import { FutureSectionCard } from './components/future-section-card';
import { ProjectDetailSkeleton } from './components/project-detail-skeleton';
import { ProjectOverviewCard } from './components/project-overview-card';
import { WebhookInfoCard } from './components/webhook-info-card';

interface ProjectDetailPageViewProps {
  deployErrorMessage: string;
  error: ApiError | null;
  errorMessage?: string;
  isDeployDisabled: boolean;
  isDeploying: boolean;
  isError: boolean;
  isLoading: boolean;
  onDeployNow: () => void;
  onRetry: () => void;
  project?: ProjectDetail;
}

export function ProjectDetailPageView({
  deployErrorMessage,
  error,
  errorMessage,
  isDeployDisabled,
  isDeploying,
  isError,
  isLoading,
  onDeployNow,
  onRetry,
  project,
}: ProjectDetailPageViewProps) {
  const t = useTranslations('pages.projectDetail');

  if (error?.statusCode === 404 || error?.error.statusCode === 404) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (isError || !project) {
    return (
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <Button variant="ghost" asChild className="-ml-3">
          <Link href="/projects">
            <ArrowLeft />
            {t('back')}
          </Link>
        </Button>
        <Card className="overflow-hidden rounded-2xl border-destructive/25 bg-destructive/5 shadow-sm">
          <CardContent className="flex min-h-72 flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <RefreshCw className="size-5" />
            </div>
            <div className="max-w-md space-y-2">
              <h1 className="text-xl font-semibold tracking-tight">{t('states.errorTitle')}</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                {errorMessage || t('states.errorDescription')}
              </p>
            </div>
            <Button onClick={onRetry}>{t('states.retry')}</Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <header className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <Button variant="ghost" asChild className="-ml-3">
            <Link href="/projects">
              <ArrowLeft />
              {t('back')}
            </Link>
          </Button>
          <div className="space-y-1.5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {project.repoFullName}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
          </div>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            {t('actions.openRepository')}
            <ExternalLink />
          </a>
        </Button>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.7fr)]">
        <DeploymentStatusCard
          deployErrorMessage={deployErrorMessage}
          isDeployDisabled={isDeployDisabled}
          isDeploying={isDeploying}
          onDeployNow={onDeployNow}
          project={project}
        />
        <WebhookInfoCard project={project} />
      </div>

      <ProjectOverviewCard project={project} />

      <div className="grid gap-5 lg:grid-cols-2">
        <FutureSectionCard kind="history" />
        <FutureSectionCard kind="logs" />
      </div>
    </section>
  );
}