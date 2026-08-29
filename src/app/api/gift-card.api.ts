import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GiftCardApi {
  private readonly baseUrl = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) { }

  createGiftCard(code: string, initialBalance: number, expiresOn?: string): Observable<any> {
    const payload: any = { code, initialBalance };
    if (expiresOn) {
      payload.expiresOn = expiresOn;
    }
    return this.http.post<any>(`${this.baseUrl}/admin/gift-cards`, payload);
  }

  getGiftCards(pageNumber: number, pageSize: number): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/admin/gift-cards`, { params }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (res?.$values) return res.$values;
        if (res?.items) return res.items;
        return res;
      })
    );
  }

  validateGiftCard(code: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/gift-cards/validate`, { code });
  }
}
