import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private jwtHelper: JwtHelperService) {}

  getCurrentUserId(): string {
    const storedUser = localStorage.getItem('user');
    const user = storedUser == null ? null : JSON.parse(storedUser);
    if (user == null) {
      return user;
    }
    const decodedToken = this.jwtHelper.decodeToken(user.token);
    return decodedToken.Id;
  }
}
