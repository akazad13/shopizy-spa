import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyApi {
  private readonly baseUrl = `${environment.apiUrl}/api/v1.0/users`;

  constructor(private readonly http: HttpClient) { }

  earnPoints(userId: string, points: number, description?: string): Observable<any> {
    const payload: any = { points };
    if (description) {
      payload.description = description;
    }
    return this.http.post<any>(`${this.baseUrl}/${userId}/loyalty/earn`, payload);
  }

  getLoyaltyAccount(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}/loyalty`);
  }

  redeemPoints(userId: string, points: number, description?: string): Observable<any> {
    const payload: any = { points };
    if (description) {
      payload.description = description;
    }
    return this.http.post<any>(`${this.baseUrl}/${userId}/loyalty/redeem`, payload);
  }
}
