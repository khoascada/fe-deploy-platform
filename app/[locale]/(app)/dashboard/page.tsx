'use client';

import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('pages.dashboard');

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>
    </section>
  );
}
