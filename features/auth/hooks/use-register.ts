'use client';
import { useUIStore } from '@/features/ui';
import type { AuthResponse, RegisterData } from '@/types';
import { useRouter } from '@i18n/navigation';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { ApiResponse } from '@lib/types/base';
import { authApi } from '@services/auth.service';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';

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

      setTheme(user.theme === 'LIGHT' ? 'light' : 'dark');
      setNextTheme(user.theme);

      const targetLocale = user.language === 'EN' ? 'en' : 'vi';

      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;

      // const targetPath = user.isVerifiedEmail === false ? '/check-email' : redirectUrl || '/projects';
      const targetPath = redirectUrl || '/projects';
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
