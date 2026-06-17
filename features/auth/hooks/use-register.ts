'use client';
import { useUIStore } from '@/features/ui';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { ApiResponse } from '@lib/types/base';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@i18n/navigation';
import { authApi } from '@services/auth.service';
import { useAuthStore } from '../store/auth-store';
import type { AuthResponse, RegisterData } from '@/types';

export function useRegister() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const router = useRouter();

  const setCredentials = useAuthStore((state) => state.setCredentials);

  const setTheme = useUIStore((state) => state.setTheme);

  const { setTheme: setNextTheme } = useTheme();

  const mutation = useAppMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
  });

  const register = async (data: RegisterData) => {

    try {
      const res: ApiResponse<AuthResponse> = await mutation.mutateAsync(data);
      const { user } = res.data;

      setCredentials({ user });

      setTheme(user?.setting?.theme || 'light');
      setNextTheme(user?.setting?.theme || 'light');

      const userLanguage = user?.setting?.language || 'VN';
      const targetLocale = userLanguage === 'EN' ? 'en' : 'vi';

      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;

      // Chưa verify email → đẩy sang /check-email để nhắc xác minh
      const targetPath = user?.is_verified === false ? '/check-email' : redirectUrl || '/home';
      router.replace(targetPath, { locale: targetLocale });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return {
    ...mutation,
    register,
  };
}
