'use client';

import { useGetMe } from '@/features/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui';
import { useRouter } from '@i18n/navigation';
import { getChangeNameAvatar } from '@lib/utils';
import { LogOut, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AvatarDropdownProps {
  onLogout: () => void;
}

export default function AvatarDropdown({ onLogout }: AvatarDropdownProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const { data: me } = useGetMe();

  const displayName = me?.name;
  const avatarAlt = displayName || t('user');

  const handleLogout = () => {
    onLogout();
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer outline-none">
          <Avatar className="h-10 w-10">
            <AvatarImage src={me?.avatarUrl ?? undefined} alt={avatarAlt} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {(displayName && getChangeNameAvatar(displayName)) || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[250px]">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-16 w-16">
            <AvatarImage src={me?.avatarUrl ?? undefined} alt={avatarAlt} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {(displayName && getChangeNameAvatar(displayName)) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-foreground font-semibold">{displayName || t('guest')}</div>
            <div className="text-muted-foreground text-sm">{me?.email || t('guestEmail')}</div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-muted-foreground" />
            <span>{t('settings')}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <LogOut size={20} className="text-muted-foreground" />
            <span>{t('logout')}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
