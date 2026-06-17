import { getTranslations } from 'next-intl/server';

export default async function LogsPage() {
  const t = await getTranslations('pages.logs');

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>
    </section>
  );
}
