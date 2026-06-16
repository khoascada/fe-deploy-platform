import { env } from '@/env';
import { OfflineBanner } from '@components/shared/offline-banner';
import { AppInitializer } from '@lib/initializer';
import Providers from '@lib/providers';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';

const OG_IMAGE = '/og-image.png';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: 'Starter App',
  description: 'A reusable Next.js starter application.',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: '/bee.svg' }],
    apple: '/favicon-180x180.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Starter App',
    title: 'Starter App',
    description: 'A reusable Next.js starter application.',
    url: '/',
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Starter App preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starter App',
    description: 'A reusable Next.js starter application.',
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <OfflineBanner />
          <AppInitializer>{children}</AppInitializer>
        </Providers>
      </body>
    </html>
  );
}
