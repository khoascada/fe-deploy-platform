'use client';

import type { LatestWebhookEvent as LatestWebhookEventData, ProjectDetail } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui';
import { getRelativeTime } from '@lib/utils/date';
import { Cable, GitBranch, GitCommit, Radio, ShieldCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  getCommitShortSha,
  getWebhookEventTone,
  getWebhookTone,
  StatusBadge,
} from './project-detail-utils';

interface WebhookInfoCardProps {
  project: ProjectDetail;
}

export function WebhookInfoCard({ project }: WebhookInfoCardProps) {
  const t = useTranslations('pages.projectDetail');
  const locale = useLocale();
  const isProvisioned = Boolean(project.webhookId);
  const latestEvent = project.latestWebhookEvent;

  return (
    <Card className="border-border/70 rounded-3xl">
      <CardHeader className="border-border/60 border-b">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg uppercase">{t('webhook.eyebrow')}</CardTitle>
            </div>
            <StatusBadge tone={getWebhookTone(project)}>
              {isProvisioned ? t('webhook.connected') : t('webhook.notConnected')}
            </StatusBadge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {/* webhook id */}
        <div className="space-y-3">
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
              <Cable className="size-4" />
              {t('webhook.fields.webhookId')}
            </div>
            <p className="mt-2 text-sm font-medium break-all">
              {project.webhookId || t('webhook.notAvailable')}
            </p>
          </div>

          {/* latest event */}
          <div className="rounded-2xl border border-dashed p-4">
            {!isProvisioned || !latestEvent ? (
              <WebhookEmptyState
                description={
                  isProvisioned
                    ? t('webhook.latest.waitingFirstDelivery')
                    : t('webhook.latest.notConnected')
                }
                title={t('webhook.latest.title')}
              />
            ) : (
              <LatestWebhookEvent
                event={latestEvent}
                receivedLabel={t('webhook.latest.received', {
                  time: getRelativeTime(latestEvent.receivedAt, locale),
                })}
                statusLabel={t(`webhook.eventStatus.${latestEvent.status}`)}
                title={t('webhook.latest.title')}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LatestWebhookEvent({
  event,
  receivedLabel,
  statusLabel,
  title,
}: {
  event: LatestWebhookEventData;
  receivedLabel: string;
  statusLabel: string;
  title: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <Radio className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase">{title}</p>
            <p className="text-sm font-semibold">{event.eventName}</p>
          </div>
        </div>
        <StatusBadge tone={getWebhookEventTone(event.status)}>{statusLabel}</StatusBadge>
      </div>

      {(event.branch || event.commitSha) && (
        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {event.branch && (
            <span className="flex items-center gap-1.5">
              <GitBranch className="size-3.5" />
              {event.branch}
            </span>
          )}
          {event.commitSha && (
            <span className="flex items-center gap-1.5 font-mono">
              <GitCommit className="size-3.5" />
              {getCommitShortSha(event.commitSha)}
            </span>
          )}
        </div>
      )}

      {event.commitMessage && (
        <p className="line-clamp-2 text-sm leading-6">{event.commitMessage}</p>
      )}
      {event.statusReason && (
        <p className="text-muted-foreground border-border/60 border-t pt-3 text-xs leading-5">
          {event.statusReason}
        </p>
      )}
      <p className="text-muted-foreground text-xs">{receivedLabel}</p>
    </div>
  );
}

function WebhookEmptyState({ description, title }: { description: string; title: string }) {
  return (
    <div className="flex items-start gap-3" role="status">
      <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-xl">
        <ShieldCheck className="size-4" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
      </div>
    </div>
  );
}
