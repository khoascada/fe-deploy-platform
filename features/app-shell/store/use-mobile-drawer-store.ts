import { create } from 'zustand';

interface MobileDrawerState {
  drawerOpen: boolean;
}

interface MobileDrawerActions {
  setDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const initialState: MobileDrawerState = {
  drawerOpen: false,
};

export const useMobileDrawerStore = create<MobileDrawerState & MobileDrawerActions>((set) => ({
  ...initialState,

  setDrawerOpen: (open: boolean) => {
    set({ drawerOpen: open });
  },

  openDrawer: () => {
    set({ drawerOpen: true });
  },

  closeDrawer: () => {
    set({ drawerOpen: false });
  },
}));
