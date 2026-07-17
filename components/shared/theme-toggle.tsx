'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui';
import { useIsAuthenticated } from '@features/auth';
import { useSetTheme } from '@features/ui';
import { devError } from '@lib/utils/logger';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('theme');
  const isAuthenticated = useIsAuthenticated();
  const { setTheme: setAppTheme } = useSetTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label={t('toggleTheme')}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    try {
      setTheme(newTheme);

      if (isAuthenticated) {
        await setAppTheme({ theme: newTheme === 'light' ? 'LIGHT' : 'DARK' });
      }
    } catch (error) {
      devError(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label={t('toggleTheme')}>
          {!isDark ? (
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          ) : (
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>{t('light')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>{t('dark')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
