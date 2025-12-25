const env = (import.meta as any)?.env || {};
const runtime = (globalThis as any)?.__STREET_CONFIG__ || {};

const normalizeApiBaseUrl = (raw: unknown): string => {
  const v = String(raw || '').trim();

  if (!v) {
    if (typeof window === 'undefined') return '';
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:5000';
    return window.location.origin;
  }

  const noTrailing = v.replace(/\/+$/, '');

  if (/^https?:\/\//i.test(noTrailing)) return noTrailing;
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(noTrailing)) return `http://${noTrailing}`;
  if (/^[a-z0-9.-]+(:\d+)?$/i.test(noTrailing)) return `https://${noTrailing}`;

  return noTrailing;
};

const rawApiBaseUrl =
  runtime.apiBaseUrl ||
  runtime.API_BASE_URL ||
  env.VITE_API_BASE_URL ||
  env.NG_APP_API_BASE_URL ||
  env.API_BASE_URL ||
  '';

export const APP_ENV = {
  apiBaseUrl: normalizeApiBaseUrl(rawApiBaseUrl),
  sentryDsn: String(runtime.sentryDsn || runtime.SENTRY_DSN || env.VITE_SENTRY_DSN || env.SENTRY_DSN || ''),
} as const;
