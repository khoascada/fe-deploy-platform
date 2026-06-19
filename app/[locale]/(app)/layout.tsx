'use client';

import { useMobileDrawerStore } from '@/features/app-shell';
import { ErrorBoundaryWithTranslation as ErrorBoundary } from '@components/errors';
import AppHeader from '@components/layouts/header/header';
import { SidebarContent } from '@components/layouts/sidebar-content';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@components/ui';
import { useIsMobile } from '@lib/hooks/use-media-query';
import { useSseConnection } from '@lib/sse';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('navigation');
  const drawerOpen = useMobileDrawerStore((state) => state.drawerOpen);
  const setDrawerOpen = useMobileDrawerStore((state) => state.setDrawerOpen);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  // đặt noti-obser và invi-obser, sse ở đây vì nó chỉ obser khi user đăng nhập.
  // useSseConnection();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className="relative flex h-[100dvh] flex-col bg-white dark:bg-black">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, oklch(0.7789 0.1103 224.47 / 59.14%) 0%, transparent 80%)',
          opacity: isDark ? 0.15 : 0.3,
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
      />

      <ErrorBoundary variant="header">
        <AppHeader drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} showSidebarToggle />
      </ErrorBoundary>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {isMobile ? (
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent
              side="left"
              className="w-[220px] bg-white p-0 dark:bg-black"
              showCloseButton={false}
            >
              <SheetTitle className="sr-only">{t('menuTitle')}</SheetTitle>
              <SheetDescription className="sr-only">{t('menuDescription')}</SheetDescription>
              <ErrorBoundary variant="sidebar">
                <div className="flex h-full w-full flex-col overflow-y-auto">
                  <SidebarContent />
                </div>
              </ErrorBoundary>
            </SheetContent>
          </Sheet>
        ) : (
          <ErrorBoundary variant="sidebar">
            <div className="flex w-[220px] flex-col overflow-y-auto border-r border-gray-200 dark:border-white/[0.08]">
              <SidebarContent />
            </div>
          </ErrorBoundary>
        )}

        <div className="flex flex-1 flex-col overflow-y-auto">
          <ErrorBoundary variant="page">
            <main className="w-full flex-1 px-8 py-4 md:px-12">{children}</main>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
