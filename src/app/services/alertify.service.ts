import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  confirm(
    title: string,
    message: string,
    okCallback: () => any,
    cancalCallback: () => any
  ) {
    alertify.confirm(
      title,
      message,
      (e: any) => {
        okCallback();
      },
      (e: any) => {
        cancalCallback();
      }
    );
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
