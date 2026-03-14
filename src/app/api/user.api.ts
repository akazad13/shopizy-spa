import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UpdateUser, UserDetails } from '../interfaces/user';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;
  private get userId(): string { return this.tokenService.getCurrentUserId()!; }

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) { }

  getUser(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.url}/users/${userId}`);
  }

  updateUser(data: UpdateUser): Observable<any> {
    return this.http.put<any>(
      `${this.url}/users/${this.userId}`,
      data
    );
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.url}/users/${this.userId}/password`, {
      oldPassword,
      newPassword
    });
  }
}
