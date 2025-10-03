// Environment variables con valores por defecto seguros
export const env = {
  // API y Endpoints
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  
  // Autenticación
  AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
  AUTH_REFRESH_TOKEN_KEY: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'refresh_token',
  
  // Aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Sistema de Gestión Escolar',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_DEBUG: import.meta.env.VITE_APP_DEBUG === 'true' || true,
  
  // Características
  ENABLE_AUTH: import.meta.env.VITE_ENABLE_AUTH !== 'false',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  
  // Configuración de UI
  DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || 'light',
  DEFAULT_LOCALE: import.meta.env.VITE_DEFAULT_LOCALE || 'es',
  
  // Límites y timeouts
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000', 10),
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880', 10), // 5MB
  
  // URLs públicas
  TERMS_URL: import.meta.env.VITE_TERMS_URL || '/terms',
  PRIVACY_URL: import.meta.env.VITE_PRIVACY_URL || '/privacy',
  HELP_URL: import.meta.env.VITE_HELP_URL || '/help',
} as const;