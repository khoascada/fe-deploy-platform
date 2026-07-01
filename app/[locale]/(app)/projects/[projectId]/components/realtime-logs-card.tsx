'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate, getRelativeTime } from '@lib/utils/date';
import { AlertTriangle, ScrollText, ServerCog, TerminalSquare } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogStream = 'SYSTEM' | 'STDOUT' | 'STDERR';

export interface DeploymentLogItem {
  createdAt: string;
  deploymentId: string;
  level: LogLevel;
  message: string;
  projectId: string;
  seq: number;
  stream: LogStream;
}

interface RealtimeLogsCardProps {
  logs?: DeploymentLogItem[];
}

const mockDeploymentLogs: DeploymentLogItem[] = [
  {
    createdAt: '2026-07-01T11:59:42.000Z',
    deploymentId: 'dep_123',
    level: 'INFO',
    message: 'Deployment accepted by runner. Preparing build workspace.',
    projectId: 'proj_123',
    seq: 29,
    stream: 'SYSTEM',
  },
  {
    createdAt: '2026-07-01T11:59:48.000Z',
    deploymentId: 'dep_123',
    level: 'INFO',
    message: 'Cloning repository github.com/acme/launchpad-web#main into /workspace.',
    projectId: 'proj_123',
    seq: 30,
    stream: 'STDOUT',
  },
  {
    createdAt: '2026-07-01T11:59:54.000Z',
    deploymentId: 'dep_123',
    level: 'DEBUG',
    message: 'Restored cached layers for node_modules and Next.js build artifacts.',
    projectId: 'proj_123',
    seq: 31,
    stream: 'SYSTEM',
  },
  {
    createdAt: '2026-07-01T12:00:00.000Z',
    deploymentId: 'dep_123',
    level: 'INFO',
    message: '#34 DONE 1.6s',
    projectId: 'proj_123',
    seq: 34,
    stream: 'STDERR',
  },
  {
    createdAt: '2026-07-01T12:00:04.000Z',
    deploymentId: 'dep_123',
    level: 'WARN',
    message: 'npm warn deprecated inflight@1.0.6: This module is not supported and may leak memory.',
    projectId: 'proj_123',
    seq: 35,
    stream: 'STDERR',
  },
  {
    createdAt: '2026-07-01T12:00:11.000Z',
    deploymentId: 'dep_123',
    level: 'INFO',
    message: 'Route /projects/[projectId] compiled successfully in 2.4s.',
    projectId: 'proj_123',
    seq: 36,
    stream: 'STDOUT',
  },
  {
    createdAt: '2026-07-01T12:00:17.000Z',
    deploymentId: 'dep_123',
    level: 'ERROR',
    message:
      'Health check failed on port 3000 after 30s. Waiting for the next platform probe before marking this run unhealthy.',
    projectId: 'proj_123',
    seq: 37,
    stream: 'SYSTEM',
  },
];

function getLevelBadgeClassName(level: LogLevel) {
  switch (level) {
    case 'ERROR':
      return 'border-destructive/25 bg-destructive/10 text-destructive';
    case 'WARN':
      return 'border-warning/25 bg-warning/10 text-warning';
    case 'INFO':
      return 'border-info/25 bg-info/10 text-info';
    case 'DEBUG':
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

function getStreamBadgeClassName(stream: LogStream) {
  switch (stream) {
    case 'STDERR':
      return 'border-warning/20 bg-warning/10 text-warning';
    case 'STDOUT':
      return 'border-info/20 bg-info/10 text-info';
    case 'SYSTEM':
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

function formatLogTime(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
}

export function RealtimeLogsCard({ logs }: RealtimeLogsCardProps) {
  const t = useTranslations('pages.projectDetail.future.logs');
  const locale = useLocale();
  const resolvedLogs = logs ?? mockDeploymentLogs;
  const latestLog = resolvedLogs.at(-1) ?? null;
  const streamCounts = resolvedLogs.reduce<Record<LogStream, number>>(
    (accumulator, log) => {
      accumulator[log.stream] += 1;
      return accumulator;
    },
    {
      STDERR: 0,
      STDOUT: 0,
      SYSTEM: 0,
    }
  );
  const sourceSummary = (['SYSTEM', 'STDOUT', 'STDERR'] as const)
    .filter((stream) => streamCounts[stream] > 0)
    .map((stream) => `${t(`streams.${stream}`)} ${streamCounts[stream]}`)
    .join(' / ');

  return (
    <Card className="overflow-hidden rounded-3xl border-border/70">
      <CardHeader className="border-b border-border/60 pb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            <TerminalSquare className="size-4" />
            {t('eyebrow')}
          </div>
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{t('description')}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs uppercase text-muted-foreground">{t('summary.totalLines')}</p>
            <p className="mt-2 font-mono text-lg font-semibold">{resolvedLogs.length}</p>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs uppercase text-muted-foreground">{t('summary.latestLevel')}</p>
            <div className="mt-2">
              {latestLog ? (
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full px-3 py-1 text-[11px] font-semibold uppercase',
                    getLevelBadgeClassName(latestLog.level)
                  )}
                >
                  {t(`levels.${latestLog.level}`)}
                </Badge>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">{t('summary.emptyValue')}</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs uppercase text-muted-foreground">{t('summary.latestEvent')}</p>
            <p className="mt-2 text-sm font-semibold">
              {latestLog ? getRelativeTime(latestLog.createdAt, locale) : t('summary.emptyValue')}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs uppercase text-muted-foreground">{t('summary.sources')}</p>
            <p className="mt-2 text-sm font-semibold leading-6">
              {sourceSummary || t('summary.emptyValue')}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              <ScrollText className="size-4" />
              {t('listTitle')}
            </div>
            <p className="hidden text-xs text-muted-foreground md:block">{t('listHint')}</p>
          </div>

          {resolvedLogs.length === 0 ? (
            <div
              className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-10 text-center"
              role="status"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <ServerCog className="size-5" />
              </div>
              <div className="max-w-md space-y-1">
                <p className="text-base font-semibold">{t('emptyTitle')}</p>
                <p className="text-sm leading-6 text-muted-foreground">{t('emptyDescription')}</p>
              </div>
            </div>
          ) : (
            <div
              aria-label={t('listAriaLabel')}
              aria-live="polite"
              className="max-h-[26rem] overflow-y-auto p-3"
              role="log"
            >
              <div className="space-y-2">
                {resolvedLogs.map((log) => (
                  <article
                    key={`${log.deploymentId}-${log.seq}`}
                    className="rounded-2xl border border-border/70 bg-background/80 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-medium text-muted-foreground">#{log.seq}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-full px-3 py-1 text-[11px] font-semibold uppercase',
                          getLevelBadgeClassName(log.level)
                        )}
                      >
                        {t(`levels.${log.level}`)}
                      </Badge>
                      <time
                        className="ml-auto text-xs text-muted-foreground"
                        dateTime={log.createdAt}
                        title={formatDate(log.createdAt, { locale, showTime: true })}
                      >
                        {formatLogTime(log.createdAt, locale)}
                      </time>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words font-mono text-sm leading-6 text-foreground">
                      {log.message}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-dashed border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p className="leading-6">{t('footnote')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
