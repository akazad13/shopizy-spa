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
        const body = error.error;
        if (body) {
          if (body.errors) {
            if (typeof body.errors === 'object' && !Array.isArray(body.errors)) {
              // ASP.NET ProblemDetails dictionary: { "Code": ["..."], ... }
              const messages: string[] = [];
              for (const key of Object.keys(body.errors)) {
                const val = body.errors[key];
                if (Array.isArray(val)) {
                  messages.push(...val);
                } else if (typeof val === 'string') {
                  messages.push(val);
                }
              }
              if (messages.length > 0) {
                errorMessage = messages.join('\n');
              } else if (body.detail) {
                errorMessage = body.detail;
              }
            } else if (Array.isArray(body.errors)) {
              errorMessage = body.errors.join('\n');
            }
          } else if (body.detail) {
            errorMessage = body.detail;
          } else if (body.message) {
            errorMessage = body.message;
          } else if (body.title) {
            errorMessage = body.title;
          }
        }

        if (errorMessage === 'An unexpected error occurred') {
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request. Please verify your submitted data.';
              break;
            case 401:
              errorMessage = 'Session expired or unauthorized. Please sign in again.';
              break;
            case 403:
              errorMessage = 'You are not authorized to perform this action.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 409:
              errorMessage = 'A conflict occurred. Please reload and try again.';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            case 0:
              errorMessage = 'Server is unreachable. Please check your connection.';
              break;
            default:
              errorMessage = error.statusText || errorMessage;
              break;
          }
        }
      }

      // We only show toast if the request hasn't set a skip-global-error header
      if (!req.headers.has('X-Skip-Error-Toast')) {
        toastService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
