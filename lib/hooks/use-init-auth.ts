'use client';
import { useAuthStore, useGetMe } from '@features/auth';
import { useEffect, useState } from 'react';

export function useInitAuth(shouldInit: boolean = true) {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const persistedUser = useAuthStore((state) => state.user);

  const [hasHydrated, setHasHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  // rehydrate auth store tránh mismatch
  useEffect(() => {
    if (hasHydrated) return;

    const unsubscribe = useAuthStore.persist.onFinishHydration(() => setHasHydrated(true));
    useAuthStore.persist.rehydrate();

    return () => unsubscribe();
  }, [hasHydrated]);

  // Chỉ verify khi đã hydrate xong và có persisted session
  const needsVerify = shouldInit && hasHydrated && !!persistedUser;

  const { isSuccess, isFetched } = useGetMe({ enabled: needsVerify });

  // ---- Đồng bộ isAuthenticated sau khi verify thành công ----
  useEffect(() => {
    if (isSuccess) setAuthenticated(true);
  }, [isSuccess, setAuthenticated]);

  // ---- Loading state ----
  let isLoading: boolean;
  if (!shouldInit) {
    isLoading = false;
  } else if (!hasHydrated) {
    isLoading = true; // chưa biết có session hay không
  } else if (!persistedUser) {
    isLoading = false; // chắc chắn chưa đăng nhập
  } else {
    isLoading = !isFetched; // có session → loading tới khi verify xong (success/error)
  }

  return { isLoading };
}
