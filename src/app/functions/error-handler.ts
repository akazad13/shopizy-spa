import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import * as alertify from 'alertifyjs';

export function handleError(form: FormGroup | null, e: any): void {
  let errorMessage = '';
  if (e instanceof HttpErrorResponse) {
    switch (e.status) {
      case 400:
      case 401:
      case 409: {
        if (!!e.error.errors && e.error.errors != null) {
          errorMessage = e.error.errors.join('\n');
        } else if (e.error.message != null) {
          errorMessage = e.error.message;
        } else {
          errorMessage =
            'Failed to find service to process the request. Please contact the administrator.';
        }
        break;
      }

      case 404: {
        errorMessage = 'The requested resource was not found.';
        break;
      }
      case 0:
      case 403:
      case 405: {
        errorMessage = e.statusText;
        break;
      }

      case 500:
      case 429: {
        errorMessage =
          'We are unable to process your request at this time. Please try again later';
        break;
      }

      default: {
        errorMessage = e.error.message;
      }
    }
  } else {
    errorMessage = e.message;
  }

  if (form) {
    form.setErrors({
      server: errorMessage?.trim()
    });
  } else {
    alertify.error(errorMessage);
  }
}
