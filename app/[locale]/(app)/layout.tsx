'use client';
export const dynamic = 'force-dynamic';
import { useMobileDrawerStore } from '@/features/app-shell';
import { ErrorBoundaryWithTranslation as ErrorBoundary } from '@components/errors';
import AppHeader from '@components/layouts/header/header';
import { SidebarContent } from '@components/layouts/sidebar-content';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@components/ui';
import { useIsMobile } from '@lib/hooks/use-media-query';
import { useTranslations } from 'next-intl';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('navigation');
  const drawerOpen = useMobileDrawerStore((state) => state.drawerOpen);
  const setDrawerOpen = useMobileDrawerStore((state) => state.setDrawerOpen);

  const isMobile = useIsMobile();
  // đặt noti-obser và invi-obser, sse ở đây vì nó chỉ obser khi user đăng nhập.
  // useSseConnection();

  return (
    <div className="bg-background text-foreground relative flex min-h-[100dvh] flex-col">
      <ErrorBoundary variant="header">
        <AppHeader drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} showSidebarToggle />
      </ErrorBoundary>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {isMobile ? (
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent
              side="left"
              className="border-border bg-card w-[220px] border-r p-0 shadow-none"
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
            <div className="border-border bg-card flex w-[220px] flex-col overflow-y-auto border-r">
              <SidebarContent />
            </div>
          </ErrorBoundary>
        )}

        <div className="flex flex-1 flex-col overflow-y-auto">
          <ErrorBoundary variant="page">
            <main className="w-full flex-1 px-6 py-4 md:px-10">{children}</main>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
