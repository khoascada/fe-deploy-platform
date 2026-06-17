import { getRequestConfig } from 'next-intl/server';
import { routing } from '@i18n/routing';
import type { Locale } from '@i18n/routing';
export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request (from [locale] segment)
  let locale = await requestLocale;

  // If no locale in request, use default locale
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale: locale as string,
    messages: (await import(`@messages/${locale}.json`)).default,
  };
});

