import { TokenService } from './token.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly tokenService: TokenService) { }

  loggedIn(): boolean {
    const token = this.tokenService.getToken();
    return token != null && !this.tokenService.isTokenExpired();
  }

  roleMatch(allowedRoles: string[]): boolean {
    const decodedToken = this.tokenService.getDecodedToken();
    const userRole = decodedToken?.role || decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    if (!userRole) {
      return false;
    }

    const userRoles: string[] = Array.isArray(userRole) ? userRole : [userRole];
    
    return allowedRoles.some(role => 
      userRoles.some(ur => ur && ur.toString().toLowerCase() === role.toLowerCase())
    );

  }
}
