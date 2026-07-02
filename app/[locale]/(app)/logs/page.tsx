import { getTranslations } from 'next-intl/server';
import { LogsPageClient } from './logs-page-client';

export default async function LogsPage() {
  const t = await getTranslations('pages.logs');

  return (
    <>
      <header className="sr-only">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </header>
      <LogsPageClient />
    </>
  );
}
