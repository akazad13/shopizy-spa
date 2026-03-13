import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { authTokenInterceptor } from './interceptors/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideNgxStripe(
      'pk_test_51Pon5dIcvuL3HXbF7MUfgw1ZFAFrsvKNedI2PnqszqTIKjUdixsu4wufLjcyYMg3GtM4427paWFNe66VJk7dctyd00UbKWebQ6'
    )
  ]
};
