'use client';

import { LogsTerminalViewer } from '@/features/logs';
import type { LogItem } from '@/types/log';
import type { DeployListItem, ProjectListItem } from '@/types/project';
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate, getRelativeTime } from '@lib/utils/date';
import { AlertCircle, History, Search, ServerCog } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface LogsPageViewProps {
  deploymentErrorMessage: string;
  deployments: DeployListItem[];
  hasSearchQuery: boolean;
  isDeploymentsError: boolean;
  isDeploymentsLoading: boolean;
  isLogsError: boolean;
  isLogsLoading: boolean;
  isProjectsError: boolean;
  isProjectsLoading: boolean;
  logs: LogItem[];
  logsErrorMessage: string;
  onDeploymentChange: (deploymentId: string) => void;
  onProjectChange: (projectId: string) => void;
  onRetryDeployments: () => void;
  onRetryProjects: () => void;
  onSearchChange: (value: string) => void;
  projectErrorMessage: string;
  projects: ProjectListItem[];
  searchQuery: string;
  selectedDeployment: DeployListItem | null;
  selectedProject: ProjectListItem | null;
}

function RailSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-2xl border p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-3 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function LogsPageView({
  deploymentErrorMessage,
  deployments,
  hasSearchQuery,
  isDeploymentsError,
  isDeploymentsLoading,
  isLogsError,
  isLogsLoading,
  isProjectsError,
  isProjectsLoading,
  logs,
  logsErrorMessage,
  onDeploymentChange,
  onProjectChange,
  onRetryDeployments,
  onRetryProjects,
  onSearchChange,
  projectErrorMessage,
  projects,
  searchQuery,
  selectedDeployment,
  selectedProject,
}: LogsPageViewProps) {
  const t = useTranslations('pages.logs');
  const locale = useLocale();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground max-w-3xl">{t('description')}</p>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="logs-project-search">
            {t('projects.title')}
          </label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="logs-project-search"
              className="pl-9"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('projects.searchPlaceholder')}
              value={searchQuery}
            />
          </div>
        </div>

        <Select onValueChange={onProjectChange} value={selectedProject?.id ?? ''}>
          <SelectTrigger aria-label={t('projects.mobileLabel')}>
            <SelectValue placeholder={t('projects.mobilePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={onDeploymentChange} value={selectedDeployment?.id ?? ''}>
          <SelectTrigger aria-label={t('deployments.mobileLabel')}>
            <SelectValue placeholder={t('deployments.mobilePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {deployments.map((deployment) => (
              <SelectItem key={deployment.id} value={deployment.id}>
                #{deployment.deploymentNumber} · {deployment.status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[20rem_20rem_minmax(0,1fr)]">
        <Card className="hidden rounded-3xl xl:block">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-1">
              <h2 className="font-semibold">{t('projects.title')}</h2>
            </div>

            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                className="pl-9"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={t('projects.searchPlaceholder')}
                value={searchQuery}
              />
            </div>

            <div className="max-h-[34rem] space-y-2 overflow-auto pr-1">
              {isProjectsLoading ? (
                <RailSkeleton />
              ) : isProjectsError ? (
                <div className="space-y-3 rounded-2xl border px-4 py-6 text-center">
                  <AlertCircle className="text-destructive mx-auto size-5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{t('projects.errorTitle')}</p>
                    <p className="text-muted-foreground text-sm">
                      {projectErrorMessage || t('projects.errorDescription')}
                    </p>
                  </div>
                  <Button onClick={onRetryProjects} size="sm">
                    {t('retry')}
                  </Button>
                </div>
              ) : projects.length === 0 ? (
                <div className="space-y-1 rounded-2xl border px-4 py-6 text-center">
                  <p className="font-semibold">
                    {hasSearchQuery ? t('projects.noResultsTitle') : t('projects.emptyTitle')}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {hasSearchQuery ? t('projects.noResultsDescription') : t('projects.emptyDescription')}
                  </p>
                </div>
              ) : (
                projects.map((project) => {
                  const isSelected = project.id === selectedProject?.id;

                  return (
                    <button
                      key={project.id}
                      className={cn(
                        'w-full rounded-2xl border px-4 py-4 text-left transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/40'
                      )}
                      onClick={() => onProjectChange(project.id)}
                      type="button"
                    >
                      <p className="font-semibold">{project.name}</p>
                      <p className="text-muted-foreground mt-1 text-sm">{project.repoFullName}</p>
                      <p className="text-muted-foreground mt-3 text-xs">
                        {project.latestDeploy
                          ? t('projects.latestDeploy', {
                              time: getRelativeTime(project.latestDeploy.createdAt, locale),
                            })
                          : t('projects.noDeployYet')}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hidden rounded-3xl xl:block">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <History className="text-muted-foreground size-4" />
                <h2 className="font-semibold">{t('deployments.title')}</h2>
              </div>
            </div>

            <div className="max-h-[34rem] space-y-2 overflow-auto pr-1">
              {isDeploymentsLoading ? (
                <RailSkeleton rows={5} />
              ) : isDeploymentsError ? (
                <div className="space-y-3 rounded-2xl border px-4 py-6 text-center">
                  <AlertCircle className="text-destructive mx-auto size-5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{t('deployments.errorTitle')}</p>
                    <p className="text-muted-foreground text-sm">
                      {deploymentErrorMessage || t('deployments.errorDescription')}
                    </p>
                  </div>
                  <Button onClick={onRetryDeployments} size="sm">
                    {t('retry')}
                  </Button>
                </div>
              ) : deployments.length === 0 ? (
                <div className="space-y-1 rounded-2xl border px-4 py-6 text-center">
                  <p className="font-semibold">{t('deployments.emptyTitle')}</p>
                  <p className="text-muted-foreground text-sm">{t('deployments.emptyDescription')}</p>
                </div>
              ) : (
                deployments.map((deployment) => {
                  const isSelected = deployment.id === selectedDeployment?.id;

                  return (
                    <button
                      key={deployment.id}
                      className={cn(
                        'w-full rounded-2xl border px-4 py-4 text-left transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/40'
                      )}
                      onClick={() => onDeploymentChange(deployment.id)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">#{deployment.deploymentNumber}</p>
                        <span className="text-muted-foreground text-xs">{deployment.status}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 font-mono text-xs">{deployment.branch}</p>
                      <p className="mt-3 text-sm">{deployment.commitMessage || t('deployments.noCommitMessage')}</p>
                      <p className="text-muted-foreground mt-3 text-xs">
                        {formatDate(deployment.createdAt, { locale, showTime: true })}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <LogsTerminalViewer
          deployment={selectedDeployment}
          isError={isLogsError}
          isLoading={isLogsLoading}
          logs={logs}
          logsErrorMessage={logsErrorMessage}
          project={selectedProject}
        />
      </div>


      <div className="xl:hidden">
        <Card className="rounded-3xl">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ServerCog className="text-muted-foreground size-4" />
                <h2 className="font-semibold">{t('selectionSummaryTitle')}</h2>
              </div>
              {/* <p className="text-muted-foreground text-sm">{t('selectionSummaryDescription')}</p> */}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <p className="text-muted-foreground text-xs uppercase">{t('projects.title')}</p>
                <p className="mt-2 font-semibold">{selectedProject?.name || t('notSelected')}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-muted-foreground text-xs uppercase">{t('deployments.title')}</p>
                <p className="mt-2 font-semibold">
                  {selectedDeployment ? `#${selectedDeployment.deploymentNumber}` : t('notSelected')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
