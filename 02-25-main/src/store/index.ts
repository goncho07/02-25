import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES } from '@/core/constants';
import { Settings, User } from '@/core/api/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

interface SettingsState {
  settings: Settings | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

interface UiState {
  breadcrumbs: { label: string; path: string }[];
  loading: boolean;
  setBreadcrumbs: (breadcrumbs: { label: string; path: string }[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          // Implementar llamada a la API de login
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            throw new Error('Invalid credentials');
          }
          
          const { user, token } = await response.json();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: null,
      theme: 'light',
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: state.settings ? { ...state.settings, ...newSettings } : null,
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
);

export const useUiStore = create<UiState>()((set) => ({
  breadcrumbs: [],
  loading: false,
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setLoading: (loading) => set({ loading }),
}));