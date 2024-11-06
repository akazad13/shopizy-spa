import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private readonly jwtHelper: JwtHelperService) {}

  getCurrentUserId(): string {
    const user = this.getStoredUser();
    if (user == null) {
      return user;
    }
    const decodedToken = this.jwtHelper.decodeToken(user.token);
    return decodedToken.id;
  }

  getToken(): string {
    const user = this.getStoredUser();
    if (user == null) {
      return user;
    }
    return user.token;
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token == null) {
      return token;
    }
    return this.jwtHelper.decodeToken(token);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return this.jwtHelper.isTokenExpired(token);
  }

  private getStoredUser() {
    const storedUser = localStorage.getItem('user');
    return storedUser == null ? null : JSON.parse(storedUser);
  }
}
