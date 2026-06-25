'use client';
import { useRouter } from '@i18n/navigation';
import { useEffect } from 'react';
import { useGetMe } from './use-get-me';

export function useRequireUnverified() {
  const router = useRouter();
  const { data, isLoading } = useGetMe();

  const isVerified = data?.isVerifiedEmail === true;

  useEffect(() => {
    if (isVerified) {
      router.replace('/home');
    }
  }, [isVerified, router]);


  const isChecking = isLoading || isVerified;

  return { isChecking };
}

