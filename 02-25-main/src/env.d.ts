/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_REFRESH_TOKEN_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_DEBUG: string
  readonly VITE_ENABLE_AUTH: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_DEFAULT_LOCALE: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_SESSION_TIMEOUT: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_TERMS_URL: string
  readonly VITE_PRIVACY_URL: string
  readonly VITE_HELP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}