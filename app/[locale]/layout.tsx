import { env } from '@/env';
import { locales, type Locale } from '@i18n/routing';
import { AppInitializer } from '@lib/initializer';
import Providers from '@lib/providers';
import '@styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

// ---- SEO Constants ----
const OG_IMAGE = '/og-image.png';
// Map locale → OpenGraph locale code (định dạng language_TERRITORY)
const OG_LOCALES: Record<string, string> = {
  vi: 'vi_VN',
  en: 'en_US',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('seo');

  const title = t('title');
  const description = t('description');
  const ogImageAlt = t('og-image-alt');

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title,
    description,
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Wordy',
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [{ url: '/bee.svg' }],
      apple: '/favicon-180x180.png',
    },
    // ---- Canonical + hreflang (multilingual SEO) ----
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: '/vi',
        en: '/en',
        'x-default': '/',
      },
    },
    // ---- Open Graph (Facebook, Zalo, LinkedIn...) ----
    openGraph: {
      type: 'website',
      siteName: 'Wordy',
      title,
      description,
      url: `/${locale}`,
      locale: OG_LOCALES[locale] ?? OG_LOCALES.vi,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    // ---- Twitter / X Card ----
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Tiêm locale vào cache để static render lấy đúng ngôn ngữ (proxy không chạy lúc prerender)
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <AppInitializer>{children}</AppInitializer>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
