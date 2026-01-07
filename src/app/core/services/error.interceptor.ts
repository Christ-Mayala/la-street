import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// Intercepteur global d'erreurs HTTP.
// But: transformer les erreurs réseau/HTTP en messages compréhensibles (pas de "Http failure response..." ou stack affiché à l'utilisateur).
// Note: on NE dépend d'aucun service qui utilise HttpClient (sinon cycle d'injection).

const toUserMessage = (err: unknown): string => {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'Connexion impossible. Vérifiez votre connexion internet et réessayez.';
    }

    const apiMsg = (err.error as any)?.message;
    if (typeof apiMsg === 'string' && apiMsg.trim()) {
      return apiMsg.trim();
    }

    if (err.status === 401) {
      return 'Session expirée. Veuillez vous reconnecter.';
    }

    if (err.status === 403) {
      return "Accès refusé. Vous n'avez pas les droits nécessaires.";
    }

    if (err.status === 404) {
      return 'Service introuvable. Réessayez plus tard.';
    }

    if (err.status >= 500) {
      return 'Le serveur rencontre un problème. Réessayez plus tard.';
    }

    return 'Une erreur est survenue. Veuillez réessayer.';
  }

  const msg = (err as any)?.message;
  if (typeof msg === 'string' && msg.trim()) {
    if (msg.includes('API base URL non configurée')) {
      return 'Service indisponible. Réessayez plus tard.';
    }
    return msg.trim();
  }

  return 'Une erreur est survenue. Veuillez réessayer.';
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      return throwError(() => new Error(toUserMessage(err)));
    }),
  );
};
