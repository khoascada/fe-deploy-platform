import { defineRouting } from 'next-intl/routing';

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'vi',
  // Locale cho request không prefix sẽ do proxy.ts tự quyết định.
  localeDetection: false,
  // Không cho next-intl tự sync NEXT_LOCALE trong middleware response.
  localeCookie: false,
});
