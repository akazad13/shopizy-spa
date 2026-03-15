import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
          case 401:
          case 409:
            if (error.error?.errors) {
              errorMessage = error.error.errors.join('\n');
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Request failed. Please try again.';
            }
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 403:
            errorMessage = 'You are not authorized to perform this action.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 0:
            errorMessage = 'Server is unreachable. Please check your connection.';
            break;
          default:
            errorMessage = error.error?.message || error.statusText || errorMessage;
            break;
        }
      }

      // We only show toast if the request hasn't set a skip-global-error header
      // or if we want global error handling by default.
      if (!req.headers.has('X-Skip-Error-Toast')) {
        toastService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
