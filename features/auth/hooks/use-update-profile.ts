'use client';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@services/auth.service';
import type { UpdateProfileData } from '@/types/auth';
import { devError } from '@lib/utils';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateProfile(data),
    onSuccess: () => {
      // Profile là của getMe — refetch ['me'] để mọi nơi (header, profile) đồng bộ
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (err) {
      devError('Lỗi cập nhật profile:', err);
      throw err;
    }
  };

  return {
    ...mutation,
    updateProfile,
  };
}
