// Tokens de diseño para colores
export const COLORS = {
  // Colores primarios
  PRIMARY: {
    MAIN: '#1976d2',
    LIGHT: '#42a5f5',
    DARK: '#1565c0',
  },
  // Colores secundarios
  SECONDARY: {
    MAIN: '#9c27b0',
    LIGHT: '#ba68c8',
    DARK: '#7b1fa2',
  },
  // Colores de error
  ERROR: {
    MAIN: '#d32f2f',
    LIGHT: '#ef5350',
    DARK: '#c62828',
  },
  // Colores de advertencia
  WARNING: {
    MAIN: '#ed6c02',
    LIGHT: '#ff9800',
    DARK: '#e65100',
  },
  // Colores informativos
  INFO: {
    MAIN: '#0288d1',
    LIGHT: '#03a9f4',
    DARK: '#01579b',
  },
  // Colores de éxito
  SUCCESS: {
    MAIN: '#2e7d32',
    LIGHT: '#4caf50',
    DARK: '#1b5e20',
  },
  // Grises
  GREY: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // Colores de texto
  TEXT: {
    PRIMARY: 'rgba(0, 0, 0, 0.87)',
    SECONDARY: 'rgba(0, 0, 0, 0.6)',
    DISABLED: 'rgba(0, 0, 0, 0.38)',
  },
  // Colores de fondo
  BACKGROUND: {
    DEFAULT: '#ffffff',
    PAPER: '#fafafa',
  },
  // Colores de borde
  DIVIDER: 'rgba(0, 0, 0, 0.12)',
} as const;

// Espaciado
export const SPACING = {
  UNIT: 8,
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

// Tipografía
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    PRIMARY: '"Roboto", "Helvetica", "Arial", sans-serif',
    SECONDARY: '"Open Sans", "Helvetica", "Arial", sans-serif',
    MONO: '"Roboto Mono", monospace',
  },
  FONT_WEIGHT: {
    LIGHT: 300,
    REGULAR: 400,
    MEDIUM: 500,
    BOLD: 700,
  },
  FONT_SIZE: {
    XS: '0.75rem',
    SM: '0.875rem',
    MD: '1rem',
    LG: '1.25rem',
    XL: '1.5rem',
    XXL: '2rem',
  },
  LINE_HEIGHT: {
    XS: 1,
    SM: 1.25,
    MD: 1.5,
    LG: 1.75,
    XL: 2,
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
} as const;

// Sombras
export const SHADOWS = {
  NONE: 'none',
  XS: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  SM: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  MD: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  LG: '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  XL: '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
} as const;

// Bordes
export const BORDERS = {
  RADIUS: {
    NONE: '0px',
    XS: '2px',
    SM: '4px',
    MD: '8px',
    LG: '12px',
    XL: '16px',
    ROUND: '50%',
  },
  WIDTH: {
    NONE: 0,
    XS: '1px',
    SM: '2px',
    MD: '3px',
    LG: '4px',
    XL: '5px',
  },
} as const;

// Transiciones
export const TRANSITIONS = {
  DURATION: {
    SHORTEST: 150,
    SHORTER: 200,
    SHORT: 250,
    STANDARD: 300,
    COMPLEX: 375,
    ENTERING_SCREEN: 225,
    LEAVING_SCREEN: 195,
  },
  EASING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    SHARP: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;

// Z-index
export const Z_INDEX = {
  MODAL: 1300,
  SNACKBAR: 1400,
  TOOLTIP: 1500,
  POPOVER: 1200,
  DRAWER: 1100,
  APP_BAR: 1100,
  MENU: 1000,
  BACKDROP: 900,
} as const;