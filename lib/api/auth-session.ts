import { useAuthStore } from '@/features/auth';
import { queryClient } from '@lib/query/query-client';

export const logoutInvalid = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('auth');
  localStorage.removeItem('recent-views-storage');
  useAuthStore.getState().logout();
  queryClient.clear();
  window.location.href = '/login?session_expired=true';
};
