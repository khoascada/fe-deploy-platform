'use client';
import type { LoginCredentials } from '@/types';
import { useUIStore } from '@/features/ui';
import { useRouter } from '@i18n/navigation';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { authApi } from '@services/auth.service';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';

export function useLogin() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const router = useRouter();

  const setCredentials = useAuthStore((state) => state.setCredentials);
  const setTheme = useUIStore((state) => state.setTheme);
  const { setTheme: setNextTheme } = useTheme();
  const mutation = useAppMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      const res = await mutation.mutateAsync(credentials);
      const { user } = res.data;

      setCredentials({ user });

      setTheme(user?.setting?.theme || 'dark');
      setNextTheme(user?.setting?.theme || 'dark');

      const userLanguage = user?.setting?.language || 'VN';
      const targetLocale = userLanguage === 'EN' ? 'en' : 'vi';

      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;

      // remove cho chắc xD
      localStorage.removeItem('recent-views-storage');

      const targetPath = redirectUrl || '/home';
      router.replace(targetPath, { locale: targetLocale });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    ...mutation,
    login,
  };
}
