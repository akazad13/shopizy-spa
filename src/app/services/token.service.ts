import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    constructor(private jwtHelper: JwtHelperService) {}

    getCurrentUserId(): string {
        const userString = localStorage.getItem('user');
        if (userString == null) {
            return '';
        }
        const user = JSON.parse(userString);
        if (user == null) {
            return user;
        }
        const decodedToken = this.jwtHelper.decodeToken(user.token);
        return decodedToken.Id;
    }
}
