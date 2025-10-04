const warnMissingEnv = (key: string) => {
  if (import.meta.env.DEV) {
    console.warn(`Environment variable ${key} is not set.`);
  }
};

type EnvKeys =
  | 'VITE_API_BASE_URL'
  | 'VITE_APP_LOGO_URL'
  | 'VITE_APP_INSTITUTION_NAME'
  | 'VITE_APP_USER_AVATAR_URL'
  | 'VITE_APP_DEFAULT_LANGUAGE'
  | 'VITE_APP_DEFAULT_USER_NAME';

const getEnvVar = (key: EnvKeys, fallback?: string) => {
  const value = import.meta.env[key];
  if (!value) {
    warnMissingEnv(key);
  }
  return (value || fallback || '').trim();
};

export const ENV = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL'),
  logoUrl: getEnvVar('VITE_APP_LOGO_URL'),
  institutionName: getEnvVar('VITE_APP_INSTITUTION_NAME'),
  userAvatar: getEnvVar('VITE_APP_USER_AVATAR_URL'),
  defaultLanguage: getEnvVar('VITE_APP_DEFAULT_LANGUAGE'),
  defaultUserName: getEnvVar('VITE_APP_DEFAULT_USER_NAME'),
};
