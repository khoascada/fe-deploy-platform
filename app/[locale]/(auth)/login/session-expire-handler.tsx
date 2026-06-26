// components/SessionExpiredHandler.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function SessionExpiredHandler() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Prevent running twice in React Strict Mode
    if (hasShownToast.current) return;

    const sessionExpired = searchParams.get('session_expired');

    if (sessionExpired === 'true') {
      hasShownToast.current = true;
      toast.info(t('sessionExpired'));
    }
  }, [searchParams, t]);

  return null;
}
