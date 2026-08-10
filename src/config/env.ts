/**
 * Environment configuration.
 * API_BASE_URL is optional for now — API integration comes later.
 */
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  APP_ENV: (import.meta.env.VITE_APP_ENV ?? 'development') as 'development' | 'staging' | 'production',
  APP_VERSION: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
};
