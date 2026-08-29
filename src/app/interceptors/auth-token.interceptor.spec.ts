import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { authTokenInterceptor } from './auth-token.interceptor';
import { TokenService } from '../services/token.service';
import { AuthApi } from '../api/auth.api';
import { of } from 'rxjs';

describe('authTokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const mockTokenService = {
    getToken: jasmine.createSpy('getToken').and.returnValue('mock-jwt-token'),
    getRefreshToken: jasmine.createSpy('getRefreshToken').and.returnValue('mock-refresh-token'),
    getCurrentUserId: () => 'test-user-id'
  };

  const mockAuthApi = {
    refreshToken: jasmine.createSpy('refreshToken').and.returnValue(
      of({ token: 'new-refreshed-token', refreshToken: 'new-refresh-token' })
    )
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: mockTokenService },
        { provide: AuthApi, useValue: mockAuthApi }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach Authorization header on API requests', () => {
    http.get('/api/v1.0/products').subscribe();

    const req = httpMock.expectOne('/api/v1.0/products');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-jwt-token');
    req.flush([]);
  });

  it('should not attach Authorization header on auth endpoints', () => {
    http.post('/api/v1.0/auth/login', { email: 'test@test.com' }).subscribe();

    const req = httpMock.expectOne('/api/v1.0/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
