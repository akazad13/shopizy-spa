import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns a normalized token from user.token', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ token: '   Bearer jwt-token-value   ' })
    );

    expect(service.getToken()).toBe('jwt-token-value');
  });

  it('returns a token from nested auth response shapes', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ result: { accessToken: 'nested-jwt-token' } })
    );

    expect(service.getToken()).toBe('nested-jwt-token');
  });
});
