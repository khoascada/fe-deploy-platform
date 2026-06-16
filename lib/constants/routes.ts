type RouteAccess = 'public' | 'landing' | 'auth-only' | 'protected' | 'admin';

type RouteConfig = {
  path: string;
  access: RouteAccess;
  exact?: boolean;
};

export const ROUTES: Record<string, RouteConfig> = {};

export const PathnameUtils = {
  getPathnameWithoutLocale: (pathname: string): string => {
    if (!pathname) return '/';

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) return '/';
    if (segments.length === 1) return '/';

    return '/' + segments.slice(1).join('/');
  },

  normalize: (pathname: string): string => {
    if (!pathname) return '/';
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  },

  matchesRoute: (pathname: string, route: string, exact?: boolean): boolean => {
    const normalizedPathname = PathnameUtils.normalize(pathname);
    const normalizedRoute = PathnameUtils.normalize(route);

    if (exact === true) {
      return normalizedPathname === normalizedRoute;
    }

    return (
      normalizedPathname === normalizedRoute || normalizedPathname.startsWith(`${normalizedRoute}/`)
    );
  },
};

// Helper to get exact value from route (handles optional property)
const getExactValue = (route: RouteConfig): boolean => route.exact ?? false;

export const RouteHelpers = {
  /**
   * Check if a route is public (accessible without auth)
   */
  isPublicRoute: (pathname: string): boolean => {
    const normalized = PathnameUtils.normalize(pathname);
    return Object.values(ROUTES).some(
      (route) =>
        route.access === 'public' &&
        PathnameUtils.matchesRoute(normalized, route.path, getExactValue(route))
    );
  },

  /**
   * Check if a route is landing (accessible without auth, if has authen then no access)
   */
  isLandingRoute: (pathname: string): boolean => {
    const normalized = PathnameUtils.normalize(pathname);
    return Object.values(ROUTES).some(
      (route) =>
        route.access === 'landing' &&
        PathnameUtils.matchesRoute(normalized, route.path, getExactValue(route))
    );
  },

  /**
   * Check if a route is auth-only (redirect if already authenticated)
   */
  isAuthRoute: (pathname: string): boolean => {
    const normalized = PathnameUtils.normalize(pathname);
    return Object.values(ROUTES).some(
      (route) =>
        route.access === 'auth-only' &&
        PathnameUtils.matchesRoute(normalized, route.path, getExactValue(route))
    );
  },

  /**
   * Check if a route is protected (requires authentication)
   */
  isProtectedRoute: (pathname: string): boolean => {
    const normalized = PathnameUtils.normalize(pathname);
    return Object.values(ROUTES).some(
      (route) =>
        route.access === 'protected' &&
        PathnameUtils.matchesRoute(normalized, route.path, getExactValue(route))
    );
  },

  /**
   * Check if a route is admin-only
   */
  isAdminRoute: (pathname: string): boolean => {
    const normalized = PathnameUtils.normalize(pathname);
    return Object.values(ROUTES).some(
      (route) =>
        route.access === 'admin' &&
        PathnameUtils.matchesRoute(normalized, route.path, getExactValue(route))
    );
  },

  /**
   * Get route config by pathname
   */
  getRouteConfig: (pathname: string) => {
    const normalized = PathnameUtils.normalize(pathname);
    return Object.values(ROUTES).find((route) =>
      PathnameUtils.matchesRoute(normalized, route.path, getExactValue(route))
    );
  },
};
