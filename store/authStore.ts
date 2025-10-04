import { create } from 'zustand';
import { BRANDING, ROLE_LABEL_KEYS, ROLES, Role } from '../config';

interface AuthenticatedUser {
  role: Role;
  displayNameKey: string;
  fullName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  login: (role: Role) => void;
  logout: () => void;
}

const DEFAULT_ROLE_NAMES: Record<Role, string> = {
  [ROLES.DIRECTOR]: BRANDING.defaultUserName,
  [ROLES.TEACHER]: BRANDING.defaultUserName,
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (role) =>
    set({
      isAuthenticated: true,
      user: {
        role,
        displayNameKey: ROLE_LABEL_KEYS[role],
        fullName: DEFAULT_ROLE_NAMES[role],
      },
    }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
