import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Address } from '../interfaces/Address';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AddressApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;
  private get userId(): string { return this.tokenService.getCurrentUserId()!; }

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.url}/users/${this.userId}/addresses`);
  }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.url}/users/${this.userId}/addresses`, address);
  }

  updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.url}/users/${this.userId}/addresses/${address.id}`, address);
  }

  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/users/${this.userId}/addresses/${addressId}`);
  }

  setDefaultAddress(addressId: string): Observable<any> {
    return this.http.post<any>(`${this.url}/users/${this.userId}/addresses/${addressId}/default`, {});
  }
}
