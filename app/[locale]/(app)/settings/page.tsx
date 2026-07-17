'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@components/ui';
import { useRouter } from '@i18n/navigation';
import { type Locale } from '@i18n/routing';
import { Globe, Lock, Palette, Pen, Upload, X, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { AvatarCropDialog } from '@components/shared/avatar-crop-dialog';
import { LOCALE_OPTIONS, useSettingsPageActions } from './use-settings-page-actions';

const ModalChangePassword = dynamic(() => import('./modal-change-password'), {
  loading: () => <div>Loading...</div>,
});

interface UserProfileCardProps {
  isEditing: boolean;
  user: any;
  tempName: string;
  tempAvatarUrl: string;
  isSavingProfile: boolean;
  isUploadingAvatar: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  startEditing: () => void;
  setIsEditing: (value: boolean) => void;
  setTempName: (value: string) => void;
  handleSaveProfile: () => Promise<void>;
  handleAvatarClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: any;
}

function UserProfileCard({
  isEditing,
  user,
  tempName,
  tempAvatarUrl,
  isSavingProfile,
  isUploadingAvatar,
  fileInputRef,
  startEditing,
  setIsEditing,
  setTempName,
  handleSaveProfile,
  handleAvatarClick,
  handleFileChange,
  t,
}: UserProfileCardProps) {
  if (isEditing) {
    return (
      <div className="bg-card border-border rounded-xl border p-6 shadow-sm space-y-6">
        <h2 className="text-foreground text-lg font-semibold">{t('editProfile')}</h2>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={handleAvatarClick}
              className="relative h-20 w-20 rounded-full overflow-hidden cursor-pointer group border-2 border-dashed border-muted hover:border-primary transition-all duration-200"
            >
              <Avatar className="h-full w-full">
                <AvatarImage src={tempAvatarUrl ?? undefined} alt="Avatar" />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Upload className="h-5 w-5 text-white" />
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{t('avatarLabel')}</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Inputs */}
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t('nameLabel')}</label>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder={t('nameLabel')}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            {t('cancel')}
          </Button>
          <Button size="sm" onClick={handleSaveProfile} loading={isSavingProfile}>
            {t('save')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name || 'User'} />
          <AvatarFallback>
            {(user?.name || 'U')
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-foreground font-semibold">{user?.name || 'Guest'}</p>
          <p className="text-muted-foreground text-sm">{user?.email || 'guest@example.com'}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={startEditing}>
        <Pen className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations('settings');

  const { handler, state } = useSettingsPageActions();
  const {
    handleLocaleChange,
    handleThemeChange,
    handleVerifyEmail,
    setOpenModal,
    setIsEditing,
    setTempName,
    handleSaveProfile,
    startEditing,
    handleAvatarClick,
    handleFileChange,
    handleCropComplete,
    setIsCropOpen,
  } = handler;

  const {
    locale,
    isDark,
    mounted,
    isSwitchingLocale,
    openModal,
    user,
    isVerified,
    isVerifying,
    isEditing,
    tempName,
    tempAvatarUrl,
    isSavingProfile,
    isUploadingAvatar,
    selectedFile,
    isCropOpen,
    fileInputRef,
  } = state;

  return (
    <div className="container mx-auto max-w-3xl space-y-10 p-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('description')}</p>
      </div>

      {/* User Profile */}
      <UserProfileCard
        isEditing={isEditing}
        user={user}
        tempName={tempName}
        tempAvatarUrl={tempAvatarUrl}
        isSavingProfile={isSavingProfile}
        isUploadingAvatar={isUploadingAvatar}
        fileInputRef={fileInputRef}
        startEditing={startEditing}
        setIsEditing={setIsEditing}
        setTempName={setTempName}
        handleSaveProfile={handleSaveProfile}
        handleAvatarClick={handleAvatarClick}
        handleFileChange={handleFileChange}
        t={t}
      />

      {/* Security Section */}
      <section className="space-y-1">
        <div className="flex items-center gap-2 pb-2">
          <Lock className="text-muted-foreground size-4" />
          <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
            {t('security')}
          </h2>
        </div>
        <div className="divide-border divide-y">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-foreground text-sm font-medium">{t('changePassword')}</p>
              <p className="text-muted-foreground text-xs">{t('updateYourPassword')}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpenModal(true)}>
              <Pen />
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-foreground text-sm font-medium">{t('verifyEmail')}</p>
                <Badge variant={isVerified ? 'default' : 'destructive'}>
                  {isVerified ? t('verified') : t('notVerified')}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">{t('verifyEmailDescription')}</p>
            </div>
            {!isVerified && (
              <Button variant="outline" size="sm" onClick={handleVerifyEmail} loading={isVerifying}>
                {t('verifyEmail')}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="space-y-1">
        <div className="flex items-center gap-2 pb-2">
          <Palette className="text-muted-foreground size-4" />
          <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
            {t('appearance')}
          </h2>
        </div>
        <div className="divide-border divide-y">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-foreground text-sm font-medium">{t('theme')}</p>
              <p className="text-muted-foreground text-xs">{t('themeDescription')}</p>
            </div>
            {mounted && (
              <Switch
                checked={isDark}
                onCheckedChange={handleThemeChange}
                aria-label={t('theme')}
              />
            )}
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="space-y-1">
        <div className="flex items-center gap-2 pb-2">
          <Globe className="text-muted-foreground size-4" />
          <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
            {t('language')}
          </h2>
        </div>
        <div className="divide-border divide-y">
          <div className="flex items-center justify-between py-3">
            <p className="text-foreground text-sm font-medium">{t('language')}</p>
            <Select
              value={locale}
              onValueChange={(val) => handleLocaleChange(val as Locale)}
              disabled={isSwitchingLocale}
            >
              <SelectTrigger className="w-36" aria-label={t('language')} size="small">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t(`languages.${opt.labelKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {openModal && <ModalChangePassword open={openModal} setOpen={setOpenModal} />}
      {isCropOpen && (
        <AvatarCropDialog
          open={isCropOpen}
          onOpenChange={setIsCropOpen}
          imageFile={selectedFile}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
