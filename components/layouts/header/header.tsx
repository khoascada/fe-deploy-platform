'use client';

import { useIsAuthenticated, useLogout } from '@/features/auth';
import AvatarDropdown from '@components/layouts/header/avatar-dropdown';
import LanguageSwitcher from '@components/shared/language-select';
import ThemeToggle from '@components/shared/theme-toggle';
import { Button, Skeleton } from '@components/ui';
import { Link } from '@i18n/navigation';
import { useInitAuth } from '@lib/hooks/use-init-auth';
import { PanelLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface AppHeaderProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  showLanguageAndThemeSwitcher?: boolean;
  showSidebarToggle?: boolean;
}

function HeaderAuthSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-20 rounded-md" />
      <Skeleton className="h-9 w-16 rounded-md" />
    </div>
  );
}

export default function AppHeader({
  drawerOpen,
  setDrawerOpen,
  showSidebarToggle,
}: AppHeaderProps) {
  const t = useTranslations('header');
  const { logout } = useLogout();
  const isAuthenticated = useIsAuthenticated();
  const { isLoading: isAuthPending } = useInitAuth(true);

  return (
    <header className="bg-background/30 border-card-border sticky top-0 z-50 flex flex-col border-b px-8 backdrop-blur">
      <div className="flex h-[64px] w-full items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Image
              src="/bee.svg"
              alt={t('logoAlt')}
              width={40}
              height={50}
              priority
              className="h-10 w-[30px] min-w-[30px]"
            />
          </Link>
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="md:hidden"
              aria-label={t('toggleMenu')}
            >
              <PanelLeft className="text-gray-700 dark:text-gray-300" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          {isAuthPending ? (
            <HeaderAuthSkeleton />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <AvatarDropdown onLogout={logout} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/register">{t('register')}</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login">{t('login')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
