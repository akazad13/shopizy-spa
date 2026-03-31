import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly userSubject: BehaviorSubject<User | null>;
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  get user(): User | null {
    return this.userSubject.value;
  }

  readonly user$: Observable<User | null>;

  constructor(private readonly http: HttpClient) {
    const storedUser = localStorage.getItem('user');

    this.userSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.user$ = this.userSubject.asObservable();
  }

  signIn(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.url}/auth/login`, {
        email,
        password
      })
      .pipe(tap((user) => this.setUser(user)));
  }

  signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post<any>(`${this.url}/auth/register`, {
      firstName,
      lastName,
      email,
      password
    });
  }

  resetPassword(newPassword: string, resetToken: string): Observable<any> {
    return this.http.post<any>(`${this.url}/auth/reset-password`, {
      newPassword,
      resetToken
    });
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.url}/auth/forgot-password`, {
      email
    });
  }

  setUser(user: User | null): void {
    this.userSubject.next(user);

    localStorage.setItem('user', JSON.stringify(user));
  }

  enable2fa(): Observable<any> {
    return this.http.post<any>(`${this.url}/auth/2fa/enable`, {});
  }

  disable2fa(): Observable<any> {
    return this.http.post<any>(`${this.url}/auth/2fa/disable`, {});
  }

  verify2fa(code: string): Observable<any> {
    return this.http.post<any>(`${this.url}/auth/2fa/verify`, { code });
  }
}
