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
  baseUrl = environment.apiUrl + '/api/v1.0/users/';

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getUser(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.baseUrl + userId);
  }

  updateUser(data: UpdateUser): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + this.tokenService.getCurrentUserId(),
      data
    );
  }
}
