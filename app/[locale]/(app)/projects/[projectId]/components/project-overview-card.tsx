'use client';

import type { ProjectDetail } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui';
import { useLocale, useTranslations } from 'next-intl';
import {
  Boxes,
  FolderTree,
  GitBranch,
  Globe,
  HardDriveDownload,
  Package,
  ServerCog,
  Waypoints,
} from 'lucide-react';
import type { ComponentType } from 'react';
import {
  formatProjectTimestamp,
  getProjectStatusTone,
  getRunnerTone,
  StatusBadge,
} from './project-detail-utils';

interface ProjectOverviewCardProps {
  project: ProjectDetail;
}

function OverviewItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border-border/60 bg-background/80 rounded-2xl border p-4">
      <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
        <Icon className="size-4" />
        {label}
      </div>
      <p className="mt-3 break-all text-sm font-medium leading-6">{value}</p>
    </div>
  );
}

export function ProjectOverviewCard({ project }: ProjectOverviewCardProps) {
  const t = useTranslations('pages.projectDetail');
  const locale = useLocale();

  return (
    <Card className="border-border/70 rounded-3xl">
      <CardHeader className="border-border/60 border-b pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl uppercase">{t('overview.eyebrow')}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={getProjectStatusTone(project.status)}>{t(`projectStatus.${project.status}`)}</StatusBadge>
            <StatusBadge tone={getRunnerTone(project.runnerType)}>{t(`runnerType.${project.runnerType}`)}</StatusBadge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <OverviewItem icon={Globe} label={t('overview.fields.repository')} value={project.repoFullName} />
            <OverviewItem icon={GitBranch} label={t('overview.fields.deployBranch')} value={project.deployBranch} />
            <OverviewItem
              icon={FolderTree}
              label={t('overview.fields.rootDirectory')}
              value={project.rootDirectory || '/'}
            />
            <OverviewItem
              icon={HardDriveDownload}
              label={t('overview.fields.buildContext')}
              value={project.buildContext || '.'}
            />
            <OverviewItem
              icon={Package}
              label={t('overview.fields.dockerfile')}
              value={project.dockerfilePath || 'Dockerfile'}
            />
            <OverviewItem
              icon={Boxes}
              label={t('overview.fields.imageName')}
              value={project.imageName || t('overview.unset')}
            />
          </div>

          <div className="from-background to-muted/30 rounded-2xl border p-5">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
                  <ServerCog className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">{t('overview.runtime.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-6">
                    {t('overview.runtime.description')}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-muted-foreground text-xs uppercase">
                    {t('overview.runtime.containerPort')}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{project.containerPort}</p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-muted-foreground text-xs uppercase">{t('overview.runtime.hostPort')}</p>
                  <p className="mt-2 text-sm font-semibold">{project.hostPort ?? t('overview.unset')}</p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-muted-foreground text-xs uppercase">
                    {t('overview.runtime.containerName')}
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold">
                    {project.containerName || t('overview.unset')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <OverviewItem
            icon={Waypoints}
            label={t('overview.fields.autoDeploy')}
            value={project.autoDeploy ? t('overview.autoDeployEnabled') : t('overview.autoDeployDisabled')}
          />
          <OverviewItem
            icon={ServerCog}
            label={t('overview.fields.createdAt')}
            value={formatProjectTimestamp(project.createdAt, locale)}
          />
          <OverviewItem
            icon={ServerCog}
            label={t('overview.fields.updatedAt')}
            value={formatProjectTimestamp(project.updatedAt, locale)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
