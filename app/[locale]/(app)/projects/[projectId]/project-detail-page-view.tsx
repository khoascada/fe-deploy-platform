'use client';

import type { DeployListItem, ProjectDetail } from '@/types/project';
import NotFoundPage from '@components/status-page/not-found';
import { Button, Card, CardContent } from '@components/ui';
import { Link } from '@i18n/navigation';
import type { ApiError } from '@lib/types/base';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DeleteProjectCard } from './components/delete-project-card';
import { DeploymentStatusCard } from './components/deployment-status-card';
import { EnvironmentVariablesCard } from './components/environment-variables-card';
import { ProjectDeploymentsCard } from './components/project-deployments-card';
import { ProjectDetailSkeleton } from './components/project-detail-skeleton';
import { ProjectOverviewCard } from './components/project-overview-card';
import { ProjectSettingsCard } from './components/project-settings-card';
import { RealtimeLogsCard } from './components/realtime-logs-card';
import { WebhookInfoCard } from './components/webhook-info-card';

interface ProjectDetailPageViewProps {
  deleteErrorMessage: string;
  deploymentErrorMessage: string;
  deployments: DeployListItem[];
  deployErrorMessage: string;
  error: ApiError | null;
  errorMessage?: string;
  isDeleting: boolean;
  isDeployDisabled: boolean;
  isDeploying: boolean;
  isDeploymentsError: boolean;
  isDeploymentsLoading: boolean;
  isError: boolean;
  isLoading: boolean;
  onDeleteProject: () => void;
  onDeployNow: () => void;
  onRetry: () => void;
  onRetryDeployments: () => void;
  onSelectDeployment: (deploymentId: string) => void;
  project?: ProjectDetail;
  resolvedLogDeploymentId?: string | null;
  resolvedLogDeploymentStatus?: string | null;
  selectedDeploymentId?: string | null;
}

export function ProjectDetailPageView({
  deleteErrorMessage,
  deploymentErrorMessage,
  deployments,
  deployErrorMessage,
  error,
  errorMessage,
  isDeleting,
  isDeployDisabled,
  isDeploying,
  isDeploymentsError,
  isDeploymentsLoading,
  isError,
  isLoading,
  onDeleteProject,
  onDeployNow,
  onRetry,
  onRetryDeployments,
  onSelectDeployment,
  project,
  resolvedLogDeploymentId,
  resolvedLogDeploymentStatus,
  selectedDeploymentId,
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
        <Card className="border-destructive/25 bg-destructive/5 overflow-hidden rounded-2xl shadow-sm">
          <CardContent className="flex min-h-72 flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
              <RefreshCw className="size-5" />
            </div>
            <div className="max-w-md space-y-2">
              <h1 className="text-xl font-semibold tracking-tight">{t('states.errorTitle')}</h1>
              <p className="text-muted-foreground text-sm leading-6">
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
      <header className="border-border/70 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <Button variant="ghost" asChild className="-ml-3">
            <Link href="/projects">
              <ArrowLeft />
              {t('back')}
            </Link>
          </Button>
          <div className="space-y-1.5">
            <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
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

      <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)]">
        <ProjectDeploymentsCard
          deploymentErrorMessage={deploymentErrorMessage}
          deployments={deployments}
          isDeploymentsError={isDeploymentsError}
          isDeploymentsLoading={isDeploymentsLoading}
          isSelectionDisabled={isDeployDisabled}
          onRetryDeployments={onRetryDeployments}
          onSelectDeployment={onSelectDeployment}
          selectedDeploymentId={selectedDeploymentId}
        />
        <RealtimeLogsCard
          key={resolvedLogDeploymentId ?? 'no-deployment'}
          deploymentId={resolvedLogDeploymentId}
          deploymentStatus={resolvedLogDeploymentStatus}
          projectId={project.id}
        />
      </div>

      <EnvironmentVariablesCard project={project} isDeployDisabled={isDeployDisabled} />

      <ProjectSettingsCard isDeploymentActive={isDeployDisabled} project={project} />

      <DeleteProjectCard
        deleteErrorMessage={deleteErrorMessage}
        isDeleting={isDeleting}
        onDeleteProject={onDeleteProject}
        projectName={project.name}
      />
    </section>
  );
}
