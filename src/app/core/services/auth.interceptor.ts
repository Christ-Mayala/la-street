import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, from } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  // Ne pas intercepter les routes d'auth pour éviter d'envoyer un vieux token
  if (req.url.includes('/user/login') || req.url.includes('/user/register') || req.url.includes('/user/refresh')) {
    return next(req);
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si 401 et qu'on a un refresh token, on tente de rafraîchir
      if (error.status === 401 && auth.refreshToken()) {
        return from(auth.refreshTokenRequest()).pipe(
          switchMap((newToken) => {
            const retryReq = req.clone({
              setHeaders: {
                'Authorization': `Bearer ${newToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Si le refresh échoue aussi, on déconnecte
            auth.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
