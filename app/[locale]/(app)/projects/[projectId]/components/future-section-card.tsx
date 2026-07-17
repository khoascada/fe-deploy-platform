'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@components/ui';
import { useTranslations } from 'next-intl';
import { History, ScrollText } from 'lucide-react';
import { EmptyMetric } from './project-detail-utils';

export function FutureSectionCard() {
  const t = useTranslations('pages.projectDetail');

  const config = {
    actionLabel: t('future.history.action'),
    description: t('future.history.description'),
    eyebrow: t('future.history.eyebrow'),
    helperDescription: t('future.history.helperDescription'),
    helperTitle: t('future.history.helperTitle'),
    icon: History,
    title: t('future.history.title'),
  };

  const Icon = config.icon;

  return (
    <Card className="border-border/70 rounded-3xl">
      <CardHeader className="border-border/60 border-b pb-5">
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-[0.24em] uppercase">
            <Icon className="size-4" />
            {config.eyebrow}
          </div>
          <CardTitle className="text-xl">{config.title}</CardTitle>
          <p className="text-muted-foreground text-sm leading-6">{config.description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <EmptyMetric title={config.helperTitle} description={config.helperDescription} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-xs uppercase">
              <ScrollText className="size-4" />
              {t('future.shared.previewTitle')}
            </div>
            <p className="mt-2 text-sm leading-6 font-medium">
              {t('future.shared.previewDescription')}
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-4">
            <div className="text-muted-foreground text-xs uppercase">
              {t('future.shared.placeholderTitle')}
            </div>
            <p className="mt-2 text-sm leading-6 font-medium">
              {t('future.shared.placeholderDescription')}
            </p>
          </div>
        </div>

        <Button variant="outline" disabled className="w-full sm:w-auto">
          {config.actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
