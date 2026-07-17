'use client';

import { Badge, Button } from '@components/ui';
import { Link } from '@i18n/navigation';
import { RadioTower } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LandingHero() {
  const t = useTranslations('landing.hero');

  return (
    <section className="space-y-7 pt-4 lg:pt-10">
      <div className="space-y-5">
        <Badge variant="outline" className="gap-2 border-border bg-surface">
          <RadioTower className="size-3.5" />
          {t('badge')}
        </Badge>

        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
            {t('description')}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild color="primary" size="lg" variant="default" className="sm:w-auto">
          <Link href="/login">{t('startNow')}</Link>
        </Button>
      </div>

    </section>
  );
}