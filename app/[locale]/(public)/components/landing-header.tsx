'use client';

import { Link } from '@i18n/navigation';
import { ServerCog } from 'lucide-react';

import LanguageSwitcher from '@components/shared/language-select';
import ThemeToggle from '@components/shared/theme-toggle';
import { Button } from '@components/ui';
import { useTranslations } from 'next-intl';

export function LandingHeader() {
  const t = useTranslations('landing.header');

  return (
    <header className="flex items-center justify-between gap-4 border-b pb-4 px-6">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md border bg-surface">
          <ServerCog className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{t('title')}</span>
          <span className="text-muted-foreground block truncate text-xs">{t('subtitle')}</span>
        </span>
      </Link>

      <nav className="flex items-center gap-2" aria-label={t('navAriaLabel')}>
        <LanguageSwitcher />
        <ThemeToggle />
        <Button asChild color="primary" size="sm">
          <Link href="/login">{t('signIn')}</Link>
        </Button>
      </nav>
    </header>
  );
}