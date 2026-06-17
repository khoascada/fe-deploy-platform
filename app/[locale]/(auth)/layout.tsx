'use client';

import { ErrorBoundaryWithTranslation as ErrorBoundary } from '@components/errors';
import LanguageSwitcher from '@components/shared/language-select';
import ThemeToggle from '@components/shared/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center">
      {/* Background radial gradient điểm nhấn */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, oklch(0.7789 0.1103 224.47 / 59.14%) 0%, transparent 70%)',
          opacity: 0.25,
        }}
      />
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <ErrorBoundary variant="page">{children}</ErrorBoundary>
    </div>
  );
}
