'use client';
import { useRouter } from '@i18n/navigation';
import { useEffect } from 'react';
import { useGetMe } from './use-get-me';

/**
 * Guard cho các page verify (/check-email, /verify-email).
 * Nguồn sự thật là getMe (KHÔNG đọc verify từ zustand auth store).
 * - Đang load getMe → isChecking = true (page render <Loading />).
 * - User đã verify → đẩy về /home.
 * Case chưa login đã được middleware chặn (route 'protected'); getMe lỗi session
 * sẽ do interceptor trong api-client tự xử lý logout/redirect.
 */
export function useRequireUnverified() {
  const router = useRouter();
  const { data, isLoading } = useGetMe();

  const isVerified = data?.is_verified === true;

  useEffect(() => {
    if (isVerified) {
      router.replace('/home');
    }
  }, [isVerified, router]);

  // Đã verify thì vẫn giữ Loading trong lúc chờ redirect để tránh flash nội dung
  const isChecking = isLoading || isVerified;

  return { isChecking };
}
