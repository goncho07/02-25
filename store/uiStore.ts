import { create } from 'zustand';
import { THEME, ThemeMode } from '../config';

const applyTheme = (theme: ThemeMode) => {
  if (theme === THEME.dark) {
    document.documentElement.classList.add(THEME.dark);
  } else {
    document.documentElement.classList.remove(THEME.dark);
  }
  localStorage.setItem(THEME.storageKey, theme);
};

interface UIState {
  isSidebarCollapsed: boolean;
  theme: ThemeMode;
  isCommandMenuOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setCommandMenuOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  theme: THEME.light,
  isCommandMenuOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === THEME.light ? THEME.dark : THEME.light;
      applyTheme(newTheme);
      return { theme: newTheme };
    }),
  setCommandMenuOpen: (isOpen) => set({ isCommandMenuOpen: isOpen }),
}));
