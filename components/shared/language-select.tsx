'use client';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@components/ui';
import { useIsAuthenticated } from '@features/auth';
import { useSetLanguage } from '@features/ui';
import { usePathname, useRouter } from '@i18n/navigation';
import { type Locale } from '@i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('language');
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const { setLanguage: setAppLanguage } = useSetLanguage();

  const switchLocale = async (newLocale: Locale) => {
    const languageCode = newLocale === 'vi' ? 'VI' : 'EN';

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    router.push(pathname, { locale: newLocale });

    if (isAuthenticated) {
      try {
        await setAppLanguage({ language: languageCode });
      } catch (err) {
        console.error(err, 'Error switching locale');
      }
    }
  };

  return (
    <div className="relative inline-block">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={() => switchLocale(locale === 'en' ? 'vi' : 'en')}>
            {locale === 'en' ? t('codeEn') : t('codeVi')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {locale === 'en' ? t('switchToVietnamese') : t('switchToEnglish')}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
