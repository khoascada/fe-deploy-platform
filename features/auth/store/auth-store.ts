import type { User } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { ROLES } from '../constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setCredentials: (data: { user: User }) => void;
  setUser: (user: User | Partial<User>) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Set credentials after login
        setCredentials: ({ user }) => {
          set({
            user,
            isAuthenticated: true,
          });
        },

        // Set isAuthenticated explicitly (called after /user/me verify)
        setAuthenticated: (value) => {
          set({ isAuthenticated: value });
        },

        // Update user data (supports partial updates)
        setUser: (user) => {
          const currentUser = get().user;
          if (currentUser) {
            // Merge with existing user for partial updates
            set({ user: { ...currentUser, ...user } });
          } else {
            // If no current user, set the new user (must be complete User object)
            set({ user: user as User });
          }
        },

        // Clear auth state on logout
        logout: () => {
          set(initialState);
        },
      }),
      {
        name: 'auth',
        storage: createJSONStorage(() => {
          // Check if we're on the client side
          if (typeof window !== 'undefined') {
            return localStorage;
          }
          // Return a no-op storage for SSR
          return {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
          };
        }),
        partialize: (state) => ({
          user: state.user
        }),
        skipHydration: true,
      }
    ),
    { name: 'AuthStore', enabled: process.env.NODE_ENV !== 'production' }
  )
);

// Selectors (similar to Redux selectors)
export const selectCurrentUser = () => useAuthStore.getState().user;
export const selectIsAuthenticated = () => useAuthStore.getState().isAuthenticated;



// Check if user has a specific role
export const selectHasRole = (roleName: string): boolean => {
  const user = useAuthStore.getState().user;
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.role_name === roleName);
};

// Check if user is admin
export const selectIsAdmin = (): boolean => {
  return selectHasRole(ROLES.ADMIN);
};
