import { Injectable, Optional } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(@Optional() private readonly jwtHelper?: JwtHelperService) {}

  private get helper(): JwtHelperService {
    return this.jwtHelper ?? new JwtHelperService();
  }

  getCurrentUserId(): string | null {
    const user = this.getStoredUser();
    if (user == null) {
      return null;
    }
    const decodedToken = this.helper.decodeToken(user.token);
    return decodedToken?.id ?? null;
  }

  getToken(): string | null {
    const user = this.getStoredUser();
    if (user == null) {
      return null;
    }
    return user.token;
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

  private getStoredUser() {
    const storedUser = localStorage.getItem('user');
    return storedUser == null ? null : JSON.parse(storedUser);
  }
}
