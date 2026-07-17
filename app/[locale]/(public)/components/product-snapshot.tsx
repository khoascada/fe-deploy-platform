'use client';

import { Badge } from '@components/ui';
import { Activity, CheckCircle2, Clock3, FileText, GitBranch } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { deploymentRows, logLines } from './landing-data';
import { StatusDot } from './status-dot';

export function ProductSnapshot() {
  const t = useTranslations('landing.snapshot');

  return (
    <section aria-label={t('title')} className="rounded-xl border bg-surface p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-2 py-3">
        <div>
          <h2 className="font-semibold">{t('title')}</h2>
          <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <StatusDot tone="success" />
          {t('live')}
        </Badge>
      </div>

      <div className="grid gap-3 pt-3 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-3">
          {deploymentRows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border bg-background/60 p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusDot tone={row.tone} />
                    <p className="truncate font-medium">{row.project}</p>
                  </div>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1.5 font-mono text-xs">
                    <GitBranch className="size-3" />
                    {row.branch}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm">{row.id}</p>
                  <p className="text-muted-foreground text-xs">{row.updatedAtKey}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{t('buildStatus')}</span>
                <span className="font-medium">{t(`status.${row.status}`)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <Activity className="text-tertiary size-4" />
              <h3 className="text-sm font-semibold">{t('envSignals')}</h3>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('production')}</span>
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="text-success size-4" />
                  {t('healthy')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('previewQueue')}</span>
                <span className="flex items-center gap-2 font-medium">
                  <Clock3 className="text-warning size-4" />
                  {t('previewQueueValue')}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-gray-900 p-3 text-gray-50 dark:bg-black">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{t('latestLogs')}</h3>
              <FileText className="size-4 text-gray-400" />
            </div>
            <div className="mt-4 space-y-2 font-mono text-xs text-gray-300">
              {logLines.map((line) => (
                <p key={line.messageKey} className="truncate">
                  {line.time} {t(`logs.${line.messageKey}`)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}