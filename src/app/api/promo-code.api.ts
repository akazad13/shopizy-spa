import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeApi {
  private readonly baseUrl = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) { }

  createPromoCode(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/promo-codes`, data);
  }

  getPromoCodes(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/admin/promo-codes`).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (res?.$values) return res.$values;
        if (res?.items) return res.items;
        return res;
      })
    );
  }

  deletePromoCode(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/promo-codes/${id}`);
  }

  updatePromoCode(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/admin/promo-codes/${id}`, data);
  }

  validatePromoCode(code: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/promo-codes/validate`, `"${code}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
