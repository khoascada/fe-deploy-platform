'use client';

import type { LogItem as DeploymentLogItem, LogLevel, LogStream } from '@/types/log';
import { Button, Skeleton } from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate } from '@lib/utils/date';
import { AlertCircle, ArrowDown, PlugZap } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useRealtimeLogsCard } from '../hooks/use-realtime-logs-card';

export type { DeploymentLogItem, LogLevel, LogStream };

interface RealtimeLogsCardProps {
  deploymentId?: string | null;
  deploymentStatus?: string | null;
  projectId?: string;
}

const LOG_TIME_FORMATTERS = {
  en: new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }),
  vi: new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }),
};

function getLevelClassName(level: LogLevel) {
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

function getStreamClassName(stream: LogStream) {
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

function formatLogTime(date: string, locale: string) {
  return (locale === 'vi' ? LOG_TIME_FORMATTERS.vi : LOG_TIME_FORMATTERS.en).format(new Date(date));
}

export function RealtimeLogsCard({ deploymentId, projectId }: RealtimeLogsCardProps) {
  const t = useTranslations('pages.projectDetail.future.logs');
  const terminalT = useTranslations('pages.logs.terminal');
  const locale = useLocale();
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [isAutoTailEnabled, setIsAutoTailEnabled] = useState(true);
  const { isError, isLoadingLogs, logsErrorMessage, resolvedLogs } = useRealtimeLogsCard({
    deploymentId,
    projectId,
  });

  useEffect(() => {
    if (!isAutoTailEnabled || !bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [isAutoTailEnabled, resolvedLogs]);

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

  return (
    <section className="border-border/70 bg-background overflow-hidden rounded-3xl border">
      <header className="border-border/70 bg-muted/30 flex flex-col gap-3 border-b px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold uppercase">{t('eyebrow')}</h2>
            {deploymentId ? (
              <span className="text-muted-foreground font-mono text-sm">{deploymentId}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isAutoTailEnabled && resolvedLogs.length > 0 ? (
            <Button size="sm" variant="outline" onClick={jumpToLatest}>
              <ArrowDown className="size-4" />
              {terminalT('jumpToLatest')}
            </Button>
          ) : null}
        </div>
      </header>

      <div className="bg-sidebar text-sidebar-foreground relative">
        {isLoadingLogs ? (
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
          <div
            className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center"
            role="alert"
          >
            <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-2xl">
              <AlertCircle className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{terminalT('states.errorTitle')}</p>
              <p className="text-sidebar-foreground/70 text-sm">
                {logsErrorMessage || terminalT('states.errorDescription')}
              </p>
            </div>
          </div>
        ) : !deploymentId ? (
          <div
            className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center"
            role="status"
          >
            <div className="bg-sidebar-accent text-sidebar-accent-foreground flex size-12 items-center justify-center rounded-2xl">
              <PlugZap className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{terminalT('states.noDeploymentTitle')}</p>
              <p className="text-sidebar-foreground/70 text-sm">
                {terminalT('states.noDeploymentDescription')}
              </p>
            </div>
          </div>
        ) : resolvedLogs.length === 0 ? (
          <div
            className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center"
            role="status"
          >
            <div className="bg-sidebar-accent text-sidebar-accent-foreground flex size-12 items-center justify-center rounded-2xl">
              <PlugZap className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{terminalT('states.emptyTitle')}</p>
              <p className="text-sidebar-foreground/70 text-sm">
                {terminalT('states.emptyDescription')}
              </p>
            </div>
          </div>
        ) : (
          <div
            ref={bodyRef}
            aria-label={t('listAriaLabel')}
            aria-live="polite"
            className="max-h-[34rem] overflow-auto px-4 py-4"
            onScroll={handleScroll}
            role="log"
          >
            <div className="space-y-1 font-mono text-sm leading-6">
              {resolvedLogs.map((log) => (
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
                  <span className={cn('font-semibold', getLevelClassName(log.level))}>
                    {log.level}
                  </span>
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
