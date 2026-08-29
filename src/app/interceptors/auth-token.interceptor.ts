import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthApi } from '../api/auth.api';

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
