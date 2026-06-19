'use client';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@services/auth.service';
import type { Me } from '@/types/auth';

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const mutation = useAppMutation({
    mutationFn: (data: FormData) => authApi.uploadAvatar(data),
  });

  const uploadAvatar = async (data: FormData) => {
    try {
      const response = await mutation.mutateAsync(data);
      const avatarUrl = response?.url;

      if (avatarUrl) {
        queryClient.setQueryData<Me>(['me'], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            avatarUrl,
          } as Me;
        });
        return avatarUrl;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    ...mutation,
    uploadAvatar,
  };
}
