import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly userSubject: BehaviorSubject<User | null>;
  baseUrl = environment.apiUrl + '/api/v1.0/auth';

  get user(): User | null {
    return this.userSubject.value;
  }

  readonly user$: Observable<User | null>;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {
    const storedUser = localStorage.getItem('user');

    this.userSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.user$ = this.userSubject.asObservable();
  }

  signIn(phone: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.baseUrl + '/login', {
        phone,
        password
      })
      .pipe(tap((user) => this.setUser(user)));
  }

  signUp(
    firstName: string,
    lastName: string,
    phone: string,
    password: string
  ): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/register', {
      firstName,
      lastName,
      phone,
      password
    });
  }

  resetPassword(newPassword: string, resetToken: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/reset-password', {
      newPassword,
      resetToken
    });
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/forgot-password', {
      email
    });
  }

  // updatePassword(oldPassword: string, newPassword: string): Observable<any> {
  //   return this.http.post<any>(this.baseUrl + '/update-password', {
  //     oldPassword,
  //     newPassword
  //   });
  // }

  setUser(user: User): void {
    this.userSubject.next(user);

    localStorage.setItem('user', JSON.stringify(user));
  }
}
