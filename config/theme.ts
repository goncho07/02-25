import { tokens } from '../design/tokens';

export const THEME = {
  storageKey: 'app-theme',
  light: 'light',
  dark: 'dark',
  mediaQuery: '(prefers-color-scheme: dark)',
  tokens,
} as const;

export type ThemeMode = typeof THEME.light | typeof THEME.dark;
