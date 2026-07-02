'use client';

import type { LogItem as DeploymentLogItem, LogLevel, LogStream } from '@/types/log';
import type { DeployStatus } from '@/types/project';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate, getRelativeTime } from '@lib/utils/date';
import { LoaderCircle, ScrollText, ServerCog } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRealtimeLogsCard } from '../hooks/use-realtime-logs-card';

export type { DeploymentLogItem, LogLevel, LogStream };

interface RealtimeLogsCardProps {
  deploymentId?: string | null;
  deploymentStatus?: DeployStatus | null;
  projectId?: string;
}

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

function formatLogTime(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
}

export function RealtimeLogsCard({
  deploymentId,
  deploymentStatus,
  projectId,
}: RealtimeLogsCardProps) {
  const t = useTranslations('pages.projectDetail.future.logs');
  const locale = useLocale();
  const { isError, isLoadingLogs, latestLog, logsErrorMessage, resolvedLogs, streamCounts } =
    useRealtimeLogsCard({ deploymentId, deploymentStatus, projectId });
  const sourceSummary = (['SYSTEM', 'STDOUT', 'STDERR'] as const)
    .filter((stream) => streamCounts[stream] > 0)
    .map((stream) => `${t(`streams.${stream}`)} ${streamCounts[stream]}`)
    .join(' / ');

  return (
    <Card className="border-border/70 overflow-hidden rounded-3xl">
      <CardHeader className="border-border/60 border-b pb-5">
        <div className="space-y-2">
          <CardTitle className="text-xl">{t('eyebrow')}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="text-muted-foreground text-xs uppercase">{t('summary.totalLines')}</p>
            <p className="mt-2 font-mono text-lg font-semibold">
              {isLoadingLogs ? '...' : resolvedLogs.length}
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="text-muted-foreground text-xs uppercase">{t('summary.latestLevel')}</p>
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
                <span className="text-muted-foreground text-sm font-medium">
                  {t('summary.emptyValue')}
                </span>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="text-muted-foreground text-xs uppercase">{t('summary.latestEvent')}</p>
            <p className="mt-2 text-sm font-semibold">
              {latestLog ? getRelativeTime(latestLog.createdAt, locale) : t('summary.emptyValue')}
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="text-muted-foreground text-xs uppercase">{t('summary.sources')}</p>
            <p className="mt-2 text-sm leading-6 font-semibold">
              {sourceSummary || t('summary.emptyValue')}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
              <ScrollText className="size-4" />
              {t('listTitle')}
            </div>
          </div>

          {isLoadingLogs ? (
            <div aria-busy="true" aria-live="polite" className="space-y-3 p-3" role="status">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="border-border/70 bg-background/80 rounded-2xl border p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-4 w-10 animate-pulse rounded" />
                    <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
                    <div className="bg-muted ml-auto h-4 w-20 animate-pulse rounded" />
                  </div>
                  <div className="bg-muted mt-3 h-4 w-full animate-pulse rounded" />
                  <div className="bg-muted mt-2 h-4 w-3/4 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div
              className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-10 text-center"
              role="alert"
            >
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
                <LoaderCircle className="size-5" />
              </div>
              <div className="max-w-md space-y-1">
                <p className="text-base font-semibold">{t('title')}</p>
                <p className="text-muted-foreground text-sm leading-6">
                  {logsErrorMessage || t('description')}
                </p>
              </div>
            </div>
          ) : resolvedLogs.length === 0 ? (
            <div
              className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-10 text-center"
              role="status"
            >
              <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
                <ServerCog className="size-5" />
              </div>
              <div className="max-w-md space-y-1">
                <p className="text-base font-semibold">{t('emptyTitle')}</p>
                <p className="text-muted-foreground text-sm leading-6">{t('emptyDescription')}</p>
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
                    className="border-border/70 bg-background/80 rounded-2xl border p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground font-mono text-xs font-medium">
                        #{log.seq}
                      </span>
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
                        className="text-muted-foreground ml-auto text-xs"
                        dateTime={log.createdAt}
                        title={formatDate(log.createdAt, { locale, showTime: true })}
                      >
                        {formatLogTime(log.createdAt, locale)}
                      </time>
                    </div>
                    <p className="text-foreground mt-3 font-mono text-sm leading-6 break-words whitespace-pre-wrap">
                      {log.message}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
