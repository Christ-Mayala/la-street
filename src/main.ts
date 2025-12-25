import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Init Sentry if configured in localStorage (set SENTRY_DSN in your environment or use localStorage.setItem('SENTRY_DSN', '<dsn>'))
try {
  const dsn = String((globalThis as any)?.__STREET_CONFIG__?.sentryDsn || (globalThis as any)?.__STREET_CONFIG__?.SENTRY_DSN || (import.meta as any)?.env?.VITE_SENTRY_DSN || (import.meta as any)?.env?.SENTRY_DSN || '');
  if (dsn) {
    import('@sentry/browser')
      .then((Sentry) => {
        Sentry.init({ dsn });
        console.log('Sentry initialized (frontend)');
      })
      .catch((err) => console.warn('Sentry init failed', err));
  }
} catch (e) { console.warn('Sentry init failed', e); }

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
