'use client';

import type { LogItem } from '@/types/log';
import type { DeployListItem, DeployStatus, ProjectListItem } from '@/types/project';
import { Button, Skeleton } from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate } from '@lib/utils/date';
import { AlertCircle, ArrowDown, CircleDot, PlugZap, TerminalSquare } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const ACTIVE_DEPLOYMENT_STATUSES = new Set<DeployStatus>([
  'QUEUED',
  'PULLING',
  'BUILDING',
  'DEPLOYING',
]);

interface LogsTerminalViewerProps {
  deployment: DeployListItem | null;
  isError?: boolean;
  isLoading?: boolean;
  logs: LogItem[];
  logsErrorMessage?: string;
  project: ProjectListItem | null;
}

function formatLogTime(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
}

function getLevelClassName(level: LogItem['level']) {
  switch (level) {
    case 'ERROR':
      return 'text-destructive';
    case 'WARN':
      return 'text-warning';
    case 'INFO':
      return 'text-foreground';
    case 'DEBUG':
    default:
      return 'text-muted-foreground';
  }
}

function getStreamClassName(stream: LogItem['stream']) {
  switch (stream) {
    case 'STDERR':
      return 'text-destructive';
    case 'STDOUT':
      return 'text-success';
    case 'SYSTEM':
    default:
      return 'text-info';
  }
}

export function LogsTerminalViewer({
  deployment,
  isError = false,
  isLoading = false,
  logs,
  logsErrorMessage,
  project,
}: LogsTerminalViewerProps) {
  const locale = useLocale();
  const t = useTranslations('pages.logs.terminal');
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [isAutoTailEnabled, setIsAutoTailEnabled] = useState(true);
  const isLive = Boolean(deployment && ACTIVE_DEPLOYMENT_STATUSES.has(deployment.status));

  useEffect(() => {
    setIsAutoTailEnabled(true);
  }, [deployment?.id]);

  useEffect(() => {
    if (!isAutoTailEnabled || !bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [isAutoTailEnabled, logs]);

  const handleScroll = () => {
    if (!bodyRef.current) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = bodyRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) <= 24;
    setIsAutoTailEnabled(isNearBottom);
  };

  const jumpToLatest = () => {
    if (!bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    setIsAutoTailEnabled(true);
  };

  const connectionLabel = isLive ? t('connection.live') : t('connection.snapshot');

  return (
    <section className="border-border/70 bg-background overflow-hidden rounded-3xl border">
      <header className="border-border/70 bg-muted/30 flex flex-col gap-3 border-b px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-[0.24em]">
            <TerminalSquare className="size-4" />
            {t('eyebrow')}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">
              {project && deployment ? t('titleWithProject', { projectName: project.name }) : t('title')}
            </h2>
            {deployment ? (
              <span className="text-muted-foreground font-mono text-sm">
                #{deployment.deploymentNumber}
              </span>
            ) : null}
          </div>
          <p className="text-muted-foreground text-sm">
            {deployment
              ? t('meta', {
                  branch: deployment.branch,
                  status: deployment.status,
                })
              : t('description')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
              isLive
                ? 'border-success/30 bg-success/10 text-success'
                : 'border-border bg-muted text-muted-foreground'
            )}
          >
            <CircleDot className={cn('size-3', isLive ? 'fill-current' : '')} />
            {connectionLabel}
          </span>
          {!isAutoTailEnabled && logs.length > 0 ? (
            <Button size="sm" variant="outline" onClick={jumpToLatest}>
              <ArrowDown className="size-4" />
              {t('jumpToLatest')}
            </Button>
          ) : null}
        </div>
      </header>

      <div className="bg-sidebar text-sidebar-foreground relative">
        {isLoading ? (
          <div aria-busy="true" className="space-y-3 p-4" role="status">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center" role="alert">
            <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-2xl">
              <AlertCircle className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{t('states.errorTitle')}</p>
              <p className="text-sidebar-foreground/70 text-sm">
                {logsErrorMessage || t('states.errorDescription')}
              </p>
            </div>
          </div>
        ) : !project ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center" role="status">
            <div className="bg-sidebar-accent text-sidebar-accent-foreground flex size-12 items-center justify-center rounded-2xl">
              <PlugZap className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{t('states.noProjectTitle')}</p>
              <p className="text-sidebar-foreground/70 text-sm">{t('states.noProjectDescription')}</p>
            </div>
          </div>
        ) : !deployment ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center" role="status">
            <div className="bg-sidebar-accent text-sidebar-accent-foreground flex size-12 items-center justify-center rounded-2xl">
              <PlugZap className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{t('states.noDeploymentTitle')}</p>
              <p className="text-sidebar-foreground/70 text-sm">{t('states.noDeploymentDescription')}</p>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center" role="status">
            <div className="bg-sidebar-accent text-sidebar-accent-foreground flex size-12 items-center justify-center rounded-2xl">
              <PlugZap className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{t('states.emptyTitle')}</p>
              <p className="text-sidebar-foreground/70 text-sm">{t('states.emptyDescription')}</p>
            </div>
          </div>
        ) : (
          <div
            ref={bodyRef}
            aria-label={t('logAriaLabel')}
            className="max-h-[34rem] overflow-auto px-4 py-4"
            onScroll={handleScroll}
            role="log"
          >
            <div className="space-y-1 font-mono text-sm leading-6">
              {logs.map((log) => (
                <div
                  key={`${log.deploymentId}-${log.seq}`}
                  className="hover:bg-sidebar-accent/40 grid grid-cols-[4.5rem_4.75rem_4rem_1fr] gap-3 rounded-lg px-2 py-1"
                >
                  <time
                    className="text-sidebar-foreground/55"
                    dateTime={log.createdAt}
                    title={formatDate(log.createdAt, { locale, showTime: true })}
                  >
                    {formatLogTime(log.createdAt, locale)}
                  </time>
                  <span className={cn('font-semibold', getStreamClassName(log.stream))}>
                    {log.stream}
                  </span>
                  <span className={cn('font-semibold', getLevelClassName(log.level))}>{log.level}</span>
                  <span className="min-w-0 break-words whitespace-pre-wrap">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
