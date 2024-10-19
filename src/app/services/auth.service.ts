import { TokenService } from './token.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  loggedIn() {
    return !this.tokenService.isTokenExpired();
  }

  roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;
    const decodedToken = this.tokenService.getDecodedToken();
    const userRoles =
      decodedToken == null ? [] : (decodedToken.role as Array<string>);
    allowedRoles.forEach((element: string) => {
      if (userRoles.includes(element)) {
        isMatch = true;
      }
    });
    return isMatch;
  }
}
