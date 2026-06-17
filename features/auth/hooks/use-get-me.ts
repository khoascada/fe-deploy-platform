'use client';
import type { Me } from '@/types';
import { useAppQuery } from '@lib/hooks/use-react-query';
import type { ApiError } from '@lib/types/base';
import { authApi } from '@services/auth.service';
import type { UseQueryOptions } from '@tanstack/react-query';

type GetMeOptions = Omit<
  UseQueryOptions<Me, ApiError, Me, string[]>,
  'queryKey' | 'queryFn'
>;

export function useGetMe(options?: GetMeOptions) {
  return useAppQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
}
