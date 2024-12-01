import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';

export function tokenGetter(): string {
  const storedUser = localStorage.getItem('user');
  const user = storedUser == null ? null : JSON.parse(storedUser);
  if (user == null) {
    return user;
  }
  return user.token;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom([
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: [environment.apiUrl.split('//')[1]], // needs to remove the https:// portion
          skipWhenExpired: true,
          disallowedRoutes: [
            `${environment.apiUrl.split('//')[1]} + /api/v1.0/auth`
          ]
        }
      })
    ]),
    provideNgxStripe(
      'pk_test_51Pon5dIcvuL3HXbF7MUfgw1ZFAFrsvKNedI2PnqszqTIKjUdixsu4wufLjcyYMg3GtM4427paWFNe66VJk7dctyd00UbKWebQ6'
    )
  ]
};
