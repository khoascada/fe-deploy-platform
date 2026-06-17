// components/SessionExpiredHandler.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth';
import { useQueryClient } from '@tanstack/react-query';
export function SessionExpiredHandler() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const hasCleared = useRef(false);
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  useEffect(() => {
    // Prevent running twice in React Strict Mode
    if (hasCleared.current) return;

    const sessionExpired = searchParams.get('session_expired');
    const hadAuth = localStorage.getItem('auth');

    if (sessionExpired === 'true' && hadAuth && !hasCleared.current) {
      hasCleared.current = true;
      localStorage.removeItem('auth');
      logout();
      queryClient.clear();
      toast.info(t('sessionExpired'));
    }
  }, [searchParams, logout, queryClient, t]);

  return null;
}
