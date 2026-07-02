'use client';

import type { ProjectDetail } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui';
import { useTranslations } from 'next-intl';
import { Cable, CheckCircle2, ShieldCheck, Webhook } from 'lucide-react';
import { getWebhookTone, StatusBadge } from './project-detail-utils';

interface WebhookInfoCardProps {
  project: ProjectDetail;
}

export function WebhookInfoCard({ project }: WebhookInfoCardProps) {
  const t = useTranslations('pages.projectDetail');
  const isProvisioned = Boolean(project.webhookId);

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
        <div className="from-background to-muted/30 rounded-2xl border p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <Webhook className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">{t('webhook.summaryTitle')}</p>
              <p className="text-muted-foreground text-sm leading-6">
                {isProvisioned ? t('webhook.summaryConnected') : t('webhook.summaryPending')}
              </p>
            </div>
          </div>
        </div>

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

          <div className="rounded-2xl border border-dashed p-4">
            <div className="flex items-start gap-3">
              <div className="bg-success/10 text-success flex size-10 items-center justify-center rounded-xl">
                {isProvisioned ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('webhook.nextStepTitle')}</p>
                <p className="text-muted-foreground text-sm leading-6">
                  {isProvisioned ? t('webhook.nextStepConnected') : t('webhook.nextStepPending')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
