'use client';
import { useRouter } from '@i18n/navigation';
import { useEffect } from 'react';
import { useGetMe } from './use-get-me';

/**
 * Guard cho cÃ¡c page verify (/check-email, /verify-email).
 * Nguá»“n sá»± tháº­t lÃ  getMe (KHÃ”NG Ä‘á»c verify tá»« zustand auth store).
 * - Äang load getMe â†’ isChecking = true (page render <Loading />).
 * - User Ä‘Ã£ verify â†’ Ä‘áº©y vá» /home.
 * Case chÆ°a login Ä‘Ã£ Ä‘Æ°á»£c middleware cháº·n (route 'protected'); getMe lá»—i session
 * sáº½ do interceptor trong api-client tá»± xá»­ lÃ½ logout/redirect.
 */
export function useRequireUnverified() {
  const router = useRouter();
  const { data, isLoading } = useGetMe();

  const isVerified = data?.isVerified === true;

  useEffect(() => {
    if (isVerified) {
      router.replace('/home');
    }
  }, [isVerified, router]);

  // ÄÃ£ verify thÃ¬ váº«n giá»¯ Loading trong lÃºc chá» redirect Ä‘á»ƒ trÃ¡nh flash ná»™i dung
  const isChecking = isLoading || isVerified;

  return { isChecking };
}

