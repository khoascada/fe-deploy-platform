'use client';

import { PathnameUtils, RouteHelpers } from '@lib/constants';
import { useInitAuth } from '@lib/hooks/use-init-auth';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Loading from '../components/status-page/loading';

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const pathname = usePathname();

  const pathnameWithoutLocale = PathnameUtils.getPathnameWithoutLocale(pathname);
  const isAuthPage = RouteHelpers.isAuthRoute(pathnameWithoutLocale);
  const isPublicPage = RouteHelpers.isPublicRoute(pathnameWithoutLocale);
  const isProtectedPage = RouteHelpers.isProtectedRoute(pathnameWithoutLocale);

  const { isLoading } = useInitAuth(!(isAuthPage || isPublicPage));

  if (isProtectedPage && isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
