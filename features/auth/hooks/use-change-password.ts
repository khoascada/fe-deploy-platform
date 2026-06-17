'use client';
import type { ChangePasswordData } from '@/types';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { authApi } from '@services/auth.service';

// Change password
export function useChangePassword() {
  const mutation = useAppMutation({
    mutationFn: (data: ChangePasswordData) => authApi.changePassword(data),
  });

  const changePassword = async (data: ChangePasswordData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    ...mutation,
    changePassword,
  };
}
