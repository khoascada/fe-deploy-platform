'use client';

import type { DeployStatus, ProjectListItem, WebhookStatus } from '@/types/project';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui';
import { cn } from '@lib/utils';
import { getRelativeTime } from '@lib/utils/date';
import { ExternalLink, GitBranch, Globe, Rocket, SquareTerminal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { GithubIcon } from '../../../components/icons';

type ProjectCardViewMode = 'grid' | 'list';

interface ProjectCardProps {
  project: ProjectListItem;
  viewMode: ProjectCardViewMode;
}

function getDeployBadgeClassName(status: DeployStatus) {
  switch (status) {
    case 'SUCCESS':
      return 'border-success/30 bg-success/15 text-success';
    case 'FAILED':
      return 'border-destructive/30 bg-destructive/15 text-destructive';
    case 'BUILDING':
      return 'border-info/30 bg-info/15 text-info';
    case 'PENDING':
      return 'border-warning/30 bg-warning/15 text-warning';
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

function getWebhookBadgeClassName(status: WebhookStatus) {
  switch (status) {
    case 'CONNECTED':
      return 'border-success/30 bg-success/15 text-success';
    case 'ERROR':
      return 'border-destructive/30 bg-destructive/15 text-destructive';
    case 'MISSING':
    default:
      return 'border-warning/30 bg-warning/15 text-warning';
  }
}

export function ProjectCard({ project, viewMode }: ProjectCardProps) {
  const t = useTranslations('pages.projects');
  const locale = useLocale();
  const latestDeploy = project.latestDeploy;
  const relativeTime = latestDeploy ? getRelativeTime(latestDeploy.createdAt, locale) : null;

  const layoutClassName =
    viewMode === 'list'
      ? 'flex h-full flex-col lg:flex-row lg:items-start lg:justify-between'
      : 'flex h-full flex-col';

  return (
    <Card className="border-border/60 bg-card/95 h-full rounded-2xl shadow-sm backdrop-blur-sm">
      <div className={layoutClassName}>
        <div className="flex-1">
          <CardHeader className="space-y-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {project.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase',
                      latestDeploy
                        ? getDeployBadgeClassName(latestDeploy.status)
                        : 'border-border bg-muted text-muted-foreground'
                    )}
                  >
                    {latestDeploy ? t(`status.${latestDeploy.status}`) : t('status.notDeployed')}
                  </Badge>
                </div>

                {/*  repo name */}
                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <GithubIcon />
                    {project.repoFullName}
                  </span>
                  <span>&middot;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <GitBranch className="h-4 w-4" />
                    {project.branch}
                  </span>
                </div>
              </div>
              {/* webhook status */}
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase',
                  getWebhookBadgeClassName(project.webhookStatus)
                )}
              >
                {t(`webhook.${project.webhookStatus}`)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5 pt-0">
            <div className=" gap-3 text-sm">
              <div className="border-border/60 bg-background/60 rounded-xl border p-3">
                <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
                  <Globe className="h-3.5 w-3.5" />
                  {t('meta.app')}
                </div>

                {project.appUrl ? (
                  <a
                    href={project.appUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=" inline-flex items-center gap-1 text-sm font-medium break-all hover:underline"
                  >
                    {project.appUrl}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <p className="text-muted-foreground">{t('meta.notAvailable')}</p>
                )}
              </div>
            </div>

            <div className="border-border/60 bg-background/60 rounded-xl border p-3">
              <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium uppercase">
                <Rocket className="h-3.5 w-3.5" />
                {t('meta.latestDeploy')}
              </div>

              {latestDeploy ? (
                <p className="text-sm leading-6">
                  <span className="font-semibold">{t(`status.${latestDeploy.status}`)}</span>
                  <span className="text-muted-foreground"> {' - '} </span>
                <span className="font-mono">{latestDeploy.commitSha.slice(0, 7)}</span>
                  <span className="text-muted-foreground"> {' - '} </span>
                  <span>{t(`trigger.${latestDeploy.triggeredBy}`)}</span>
                  <span className="text-muted-foreground"> {' - '} </span>
                  <span>{relativeTime}</span>
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">{t('meta.notDeployed')}</p>
              )}
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">{t('meta.deployments')}</span>
              <span className="ml-2 font-semibold">{project.deployCount}</span>
            </div>
          </CardContent>
        </div>

        <CardFooter className="flex flex-wrap gap-2 p-5 pt-0 lg:flex-col lg:pt-5">
          <Button variant="outline" className="flex-1 lg:w-full" disabled>
            {t('actions.viewDetail')}
          </Button>
          <Button color="primary" className="flex-1 lg:w-full" disabled>
            {t('actions.deployNow')}
          </Button>
          <Button variant="ghost" color="secondary" className="flex-1 lg:w-full" disabled>
            <SquareTerminal className="h-4 w-4" />
            {t('actions.viewLogs')}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
