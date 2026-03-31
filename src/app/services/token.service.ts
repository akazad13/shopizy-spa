import { Injectable, Optional } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly userStorageKey = 'user';

  constructor(@Optional() private readonly jwtHelper?: JwtHelperService) {}

  private get helper(): JwtHelperService {
    return this.jwtHelper ?? new JwtHelperService();
  }

  getCurrentUserId(): string | null {
    const decodedToken = this.getDecodedToken();

    return (
      this.getStoredUserId() ??
      decodedToken?.id ??
      decodedToken?.sub ??
      decodedToken?.nameid ??
      decodedToken?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] ??
      null
    );
  }

  getToken(): string | null {
    const user = this.getStoredUser();
    if (user == null) {
      return null;
    }

    return this.extractToken(user);
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (token == null) {
      return null;
    }
    return this.helper.decodeToken(token);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return !!token && this.helper.isTokenExpired(token);
  }

  private getStoredUserId(): string | null {
    const user = this.getStoredUser();

    return (
      user?.id ??
      user?.userId ??
      user?.data?.id ??
      user?.data?.userId ??
      user?.result?.id ??
      user?.result?.userId ??
      null
    );
  }

  private extractToken(user: any): string | null {
    const tokenCandidates = [
      user,
      user?.token,
      user?.accessToken,
      user?.jwt,
      user?.data,
      user?.data?.token,
      user?.data?.accessToken,
      user?.data?.jwt,
      user?.result,
      user?.result?.token,
      user?.result?.accessToken,
      user?.result?.jwt
    ];

    for (const candidate of tokenCandidates) {
      const token = this.normalizeToken(candidate);

      if (token != null) {
        return token;
      }
    }

    return null;
  }

  private normalizeToken(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalizedToken = value.trim().replace(/^Bearer\s+/i, '').trim();

    return normalizedToken === '' ? null : normalizedToken;
  }

  private getStoredUser(): any | null {
    const storedUser = localStorage.getItem(this.userStorageKey);

    if (storedUser == null || storedUser === '') {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }
}
