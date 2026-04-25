import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenService } from '../services/token.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(TokenService);
  const requestUrl = new URL(request.url, window.location.origin);
  const apiBaseUrl = new URL(environment.apiUrl || window.location.origin);
  const isApiRequest = requestUrl.pathname.startsWith('/api/');
  const isAuthRequest = requestUrl.pathname.startsWith('/api/v1.0/auth');
  const isTargetApiRequest =
    requestUrl.origin === apiBaseUrl.origin ||
    request.url.startsWith(environment.apiUrl);

  if (!isApiRequest || !isTargetApiRequest || isAuthRequest) {
    return next(request);
  }

  const token = tokenService.getToken();

  if (token == null || token === '') {
    return next(request);
  }

  return next(
    request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    })
  );
};
