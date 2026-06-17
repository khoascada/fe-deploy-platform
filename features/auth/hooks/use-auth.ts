'use client';
import { selectIsAdmin, useAuthStore } from '../store/auth-store';

export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}

export const useIsOwner = (ownerId: number) => {
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.id === ownerId;
  return isOwner;
};

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useIsAdmin() {
  return selectIsAdmin();
}

export function useAuth() {
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  return {
    user,
    isAuthenticated,
    isAdmin,
  };
}
