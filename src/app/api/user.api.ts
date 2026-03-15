import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      data,
      { headers: new HttpHeaders({ 'X-Skip-Error-Toast': 'true' }) }
    );
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.url}/users/${this.userId}/password`, {
      oldPassword,
      newPassword
    }, { headers: new HttpHeaders({ 'X-Skip-Error-Toast': 'true' }) });
  }

  // --- ADMIN ENDPOINTS ---

  getAllUsers(pageNumber: number = 1, pageSize: number = 50): Observable<UserDetails[]> {
    return this.http.get<UserDetails[]>(`${this.url}/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.patch<any>(`${this.url}/users/${userId}/role`, { role });
  }
}
