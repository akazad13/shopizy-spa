import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthApi } from '../api/auth.api';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(TokenService);
  const authApi = inject(AuthApi);

  let req = request;
  const isApiRequest = req.url.includes('/api/');
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh') ||
    req.url.includes('/auth/refresh-token');

  // Add Idempotency key on critical state-modifying requests (e.g. POST /orders, POST /checkout)
  if (
    req.method === 'POST' &&
    (req.url.includes('/orders') || req.url.includes('/checkout')) &&
    !req.headers.has('X-Idempotency-Key')
  ) {
    req = req.clone({
      headers: req.headers.set('X-Idempotency-Key', generateUUID())
    });
  }

  // Attach Bearer token if not auth endpoint
  if (isApiRequest && !isAuthEndpoint) {
    const token = tokenService.getToken();
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        const token = tokenService.getToken();
        const refreshToken = tokenService.getRefreshToken();
        if (token && refreshToken) {
          return authApi.refreshToken(token, refreshToken).pipe(
            switchMap((res) => {
              const newToken = res?.token || tokenService.getToken();
              const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(clonedReq);
            }),
            catchError((refreshErr) => {
              return throwError(() => refreshErr);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
