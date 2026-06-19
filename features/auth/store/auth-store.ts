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

        setCredentials: ({ user }) => {
          set({
            user,
            isAuthenticated: true,
          });
        },

        setAuthenticated: (value) => {
          set({ isAuthenticated: value });
        },

        setUser: (user) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, ...user } });
          } else {
            set({ user: user as User });
          }
        },

        logout: () => {
          set(initialState);
        },
      }),
      {
        name: 'auth',
        storage: createJSONStorage(() => {
          if (typeof window !== 'undefined') {
            return localStorage;
          }
          return {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
          };
        }),
        partialize: (state) => ({
          user: state.user,
        }),
        skipHydration: true,
      }
    ),
    { name: 'AuthStore', enabled: process.env.NODE_ENV !== 'production' }
  )
);

export const selectCurrentUser = () => useAuthStore.getState().user;
export const selectIsAuthenticated = () => useAuthStore.getState().isAuthenticated;

export const selectHasRole = (roleName: string): boolean => {
  const user = useAuthStore.getState().user;
  return user?.role === roleName.toUpperCase();
};

export const selectIsAdmin = (): boolean => {
  return selectHasRole(ROLES.ADMIN);
};
