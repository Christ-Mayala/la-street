interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly NG_APP_API_BASE_URL?: string;
  readonly API_BASE_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
