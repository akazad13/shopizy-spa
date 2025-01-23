import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alertify: AlertifyService
  ) {}
  canActivate(next: ActivatedRouteSnapshot): boolean {
    const authGuardMode = next.data['authGuardMode'] || 'redirectToLogin';
    const roles = next.data['roles'] as Array<string>;

    if (roles) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      } else {
        this.router.navigate(['/']);
        this.alertify.error('You are not authorized to access this data');
      }
    }

    if (authGuardMode === 'redirectToLogin') {
      if (!this.authService.loggedIn()) {
        this.router.navigate(['auth/login']);
        return false;
      }
    } else if (authGuardMode === 'redirectToDashboard') {
      if (this.authService.loggedIn()) {
        this.router.navigate(['/']);
        return false;
      }
    }
    return true;
  }
}
