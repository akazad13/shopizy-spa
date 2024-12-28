import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  baseUrl = environment.apiUrl + '/api/v1.0/users/';

  constructor(private readonly http: HttpClient) {}

  getUser(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.baseUrl + userId);
  }
}
