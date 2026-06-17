'use client';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { authApi } from '@services/auth.service';

export function useLogout() {
  const mutation = useAppMutation({
    mutationFn: authApi.logout,
  });

  const logout = async () => {
    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      localStorage.removeItem('auth');
      localStorage.removeItem('recent-views-storage');
      window.location.href = '/login'
    }
  };

  return {
    ...mutation,
    logout,
  };
}
