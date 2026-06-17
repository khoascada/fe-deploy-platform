import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import { env } from './env';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false, // Tắt tất cả development indicators (build activity, prerender indicators)

  // Proxy API requests to backend (same-origin for cookies)
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${env.BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
