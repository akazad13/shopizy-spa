import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UpdateUser, UserDetails } from '../interfaces/user';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;
  private get userId(): string {
    return this.tokenService.getCurrentUserId()!;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getUser(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.url}/users/${userId}`);
  }

  updateUser(data: UpdateUser): Observable<any> {
    return this.http.put<any>(`${this.url}/users/${this.userId}`, data, {
      headers: new HttpHeaders({ 'X-Skip-Error-Toast': 'true' })
    });
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.patch<any>(
      `${this.url}/users/${this.userId}/password`,
      {
        oldPassword,
        newPassword
      },
      { headers: new HttpHeaders({ 'X-Skip-Error-Toast': 'true' }) }
    );
  }

  // --- ADMIN ENDPOINTS ---

  getAllUsers(
    pageNumber: number = 1,
    pageSize: number = 50
  ): Observable<UserDetails[]> {
    return this.http
      .get<any>(
        `${this.url}/admin/users?pageNumber=${pageNumber}&pageSize=${pageSize}`
      )
      .pipe(
        map((res) => {
          if (Array.isArray(res)) return res as UserDetails[];
          if (res?.$values && Array.isArray(res.$values))
            return res.$values as UserDetails[];
          if (res?.items && Array.isArray(res.items))
            return res.items as UserDetails[];
          if (res?.items?.$values && Array.isArray(res.items.$values))
            return res.items.$values as UserDetails[];
          return [];
        })
      );
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.patch<any>(`${this.url}/admin/users/${userId}/role`, {
      role
    });
  }

  // --- ADDRESSES ---

  getAddresses(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/users/${userId}/addresses`);
  }

  addAddress(userId: string, address: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/users/${userId}/addresses`,
      address
    );
  }

  updateAddress(
    userId: string,
    addressId: string,
    address: any
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.url}/users/${userId}/addresses/${addressId}`,
      address
    );
  }

  deleteAddress(userId: string, addressId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/users/${userId}/addresses/${addressId}`
    );
  }

  setDefaultAddress(userId: string, addressId: string): Observable<any> {
    return this.http.patch<any>(
      `${this.url}/users/${userId}/addresses/${addressId}/set-default`,
      {}
    );
  }

  // --- TWO FACTOR (User specific) ---

  enableTwoFactor(userId: string): Observable<any> {
    return this.http.post<any>(
      `${this.url}/users/${userId}/two-factor/enable`,
      {}
    );
  }

  disableTwoFactor(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/users/${userId}/two-factor`);
  }

  verifyTwoFactor(userId: string, code: string): Observable<any> {
    return this.http.post<any>(
      `${this.url}/users/${userId}/two-factor/verify`,
      { code }
    );
  }
}
