import { Locale, routing } from '@i18n/routing';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { RouteHelpers } from './lib/constants';
import { isAdmin } from './lib/utils/role';
// Middleware i18n
const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { isAuthRoute, isProtectedRoute, isAdminRoute, isPublicRoute } = RouteHelpers;
  const { pathname } = request.nextUrl;
  const pathnameLocale = pathname.split('/')[1];
  const isValidLocale = routing.locales.includes(pathnameLocale as Locale);
  const pathnameWithoutLocale = isValidLocale
    ? pathname.replace(`/${pathnameLocale}`, '') || '/'
    : pathname;

  const hasRefreshToken = request.cookies.has('refresh_token');

  const userRoles = request.cookies.get('permission')?.value || '[]';

  const isAdminUser = isAdmin(userRoles);

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const preferredLocale: Locale =
    isValidLocale
      ? (pathnameLocale as Locale)
      : cookieLocale && routing.locales.includes(cookieLocale as Locale)
        ? (cookieLocale as Locale)
        : routing.defaultLocale;


  if (!hasRefreshToken && isProtectedRoute(pathnameWithoutLocale)) {
    const loginUrl = new URL(`/${preferredLocale}/login`, request.url);
    // Save redirect URL (kèm query string) để quay lại sau login — giữ token verify-email
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If has RT and on auth page, landing page → redirect to home (already logged in)
  if (
    hasRefreshToken &&
    (isAuthRoute(pathnameWithoutLocale) || isPublicRoute(pathnameWithoutLocale))
  ) {
    return NextResponse.redirect(new URL(`/${preferredLocale}/projects`, request.url));
  }

  if (!isAdminUser && isAdminRoute(pathnameWithoutLocale)) {
    return NextResponse.rewrite(new URL(`/${preferredLocale}/403`, request.url));
  }

  if (!isValidLocale && preferredLocale !== routing.defaultLocale) {
    return NextResponse.redirect(new URL(`/${preferredLocale}${pathnameWithoutLocale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
