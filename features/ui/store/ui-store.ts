import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIStoreState {
  theme: 'light' | 'dark';
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark') => void;
}

const initialState: UIStoreState = {
  theme: 'light',
};

export const useUIStore = create<UIStoreState & UIActions>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
      },
    }),
    {
      name: 'ui',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }

        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
