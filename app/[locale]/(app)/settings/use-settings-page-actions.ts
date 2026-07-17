'use client';

import {
  MAX_RESEND_VERIFY_TIMES,
  useGetMe,
  useIsAuthenticated,
  useUpdateProfile,
  useUploadAvatar,
} from '@features/auth';
import { useSetLanguage, useSetTheme, useUIStore } from '@features/ui';
import { usePathname, useRouter } from '@i18n/navigation';
import { type Locale, locales } from '@i18n/routing';
import { useAppMutation } from '@lib/hooks/use-react-query';
import { useTranslateError } from '@lib/hooks/use-translate-error';
import type { ApiError } from '@lib/types/base';
import { devLog } from '@/lib/utils';
import { authApi } from '@services/auth.service';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useRef, ChangeEvent, RefObject } from 'react';
import { toast } from 'sonner';

export type LocaleOption = {
  value: Locale;
  labelKey: 'vi' | 'en';
};

export const LOCALE_OPTIONS: LocaleOption[] = locales.map((l) => ({
  value: l,
  labelKey: l as 'vi' | 'en',
}));

export interface SettingsPageActions {
  handler: {
    handleLocaleChange: (newLocale: Locale) => Promise<void>;
    handleThemeChange: () => void;
    handleVerifyEmail: () => Promise<void>;
    setOpenModal: (value: boolean) => void;
    setIsEditing: (value: boolean) => void;
    setTempName: (value: string) => void;
    setTempAvatarUrl: (value: string) => void;
    handleSaveProfile: () => Promise<void>;
    handleAvatarUpload: (file: File) => Promise<void>;
    startEditing: () => void;
    handleAvatarClick: () => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleCropComplete: (croppedFile: File) => void;
    setIsCropOpen: (open: boolean) => void;
  };
  state: {
    locale: Locale;
    isDark: boolean;
    mounted: boolean;
    isSwitchingLocale: boolean;
    openModal: boolean;
    user: ReturnType<typeof useGetMe>['data'];
    isVerified: boolean;
    isVerifying: boolean;
    isEditing: boolean;
    tempName: string;
    tempAvatarUrl: string;
    isSavingProfile: boolean;
    isUploadingAvatar: boolean;
    selectedFile: File | null;
    isCropOpen: boolean;
    fileInputRef: RefObject<HTMLInputElement | null>;
  };
}

export const useSettingsPageActions = (): SettingsPageActions => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations('settings');
  const tAuth = useTranslations('auth');
  const queryClient = useQueryClient();
  const { getErrorMessage } = useTranslateError();

  const { data: user } = useGetMe();
  const isAuthenticated = useIsAuthenticated();

  const { updateProfile, isPending: isSavingProfile } = useUpdateProfile();
  const { uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: resend, isPending: isVerifying } = useAppMutation({
    mutationFn: () => authApi.resendVerify(),
  });

  const { resolvedTheme, setTheme } = useTheme();
  const { setTheme: setAppTheme } = useSetTheme();
  const setThemeStore = useUIStore((state) => state.setTheme);
  const { setLanguage: setAppLanguage } = useSetLanguage();

  const [mounted, setMounted] = useState(false);
  const [isSwitchingLocale, setIsSwitchingLocale] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const startEditing = () => {
    setTempName(user?.name || '');
    setTempAvatarUrl(user?.avatarUrl || '');
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!tempName.trim()) {
      toast.error(tAuth('validation.nameRequired'));
      return;
    }
    try {
      await updateProfile({
        name: tempName,
        avatarUrl: tempAvatarUrl || undefined,
      });
      setIsEditing(false);
      toast.success(t('successUpdateProfile'));
    } catch (err) {
      toast.error(t('failedUpdateProfile'));
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const url = await uploadAvatar(formData);
      if (url) {
        setTempAvatarUrl(url);
      }
    } catch (err) {
      toast.error('Failed to upload avatar.');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsCropOpen(true);
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    handleAvatarUpload(croppedFile);
    setSelectedFile(null);
  };

  const handleThemeChange = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeStore(newTheme);

    if (isAuthenticated) {
      try {
        await setAppTheme({ theme: newTheme === 'light' ? 'LIGHT' : 'DARK' });
      } catch (err) {
        devLog(err);
      }
    }
  };

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === locale || isSwitchingLocale) return;

    setIsSwitchingLocale(true);
    const languageCode = newLocale === 'vi' ? 'VI' : 'EN';

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    if (isAuthenticated) {
      try {
        await setAppLanguage({ language: languageCode });
      } catch (err) {
        devLog(err);
        toast.error(t('languageError'));
        setIsSwitchingLocale(false);
        return;
      }
    }

    router.push(pathname, { locale: newLocale });
  };

  const handleVerifyEmail = async () => {
    const isOutOfResend = ((user as any)?.resend_verify_times ?? 0) >= MAX_RESEND_VERIFY_TIMES;
    try {
      if (!isOutOfResend) {
        await resend();
        await queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success(tAuth('verify.resend-success'));
      }
    } catch (error) {
      toast.error(getErrorMessage(error as ApiError) || tAuth('verify.resend-error'));
    } finally {
      router.push('/check-email');
    }
  };

  return {
    handler: {
      handleLocaleChange,
      handleThemeChange,
      handleVerifyEmail,
      setOpenModal,
      setIsEditing,
      setTempName,
      setTempAvatarUrl,
      handleSaveProfile,
      handleAvatarUpload,
      startEditing,
      handleAvatarClick,
      handleFileChange,
      handleCropComplete,
      setIsCropOpen,
    },
    state: {
      locale,
      isDark,
      mounted,
      isSwitchingLocale,
      openModal,
      user,
      isVerified: !!user?.isVerifiedEmail,
      isVerifying,
      isEditing,
      tempName,
      tempAvatarUrl,
      isSavingProfile,
      isUploadingAvatar,
      selectedFile,
      isCropOpen,
      fileInputRef,
    },
  };
};



