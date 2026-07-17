'use client';

import { Card, CardContent } from '@components/ui';
import { useTranslations } from 'next-intl';

import { engineeringHighlights } from './landing-data';

export function EngineeringHighlights() {
  const t = useTranslations('landing.benefits');

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-labelledby="capabilities-title">
      <div className="md:col-span-2 xl:col-span-3">
        <h2 id="capabilities-title" className="text-xl font-semibold tracking-tight">
          {t('title')}
        </h2>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          {t('description')}
        </p>
      </div>

      {engineeringHighlights.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.key} className="rounded-lg shadow-none">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-md border bg-accent">
                  <Icon className="size-4" />
                </span>
                <h3 className="font-semibold">{t(`items.${item.key}.title`)}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-6">{t(`items.${item.key}.description`)}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}