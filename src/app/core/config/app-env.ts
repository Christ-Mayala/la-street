const env = (import.meta as any)?.env || {};
const runtime = (globalThis as any)?.__STREET_CONFIG__ || {};

export const APP_ENV = {
  apiBaseUrl: String(
    runtime.apiBaseUrl ||
      runtime.API_BASE_URL ||
      env.VITE_API_BASE_URL ||
      env.NG_APP_API_BASE_URL ||
      env.API_BASE_URL ||
      '',
  ),
  sentryDsn: String(runtime.sentryDsn || runtime.SENTRY_DSN || env.VITE_SENTRY_DSN || env.SENTRY_DSN || ''),
} as const;
