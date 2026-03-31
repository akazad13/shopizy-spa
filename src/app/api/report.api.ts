import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportApi {
  private readonly url = `${environment.apiUrl}/api/v1.0/admin/reports`;

  constructor(private readonly http: HttpClient) { }

  getSales(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any>(`${this.url}/sales`, { params });
  }

  getTopCustomers(count: number): Observable<any[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<any[]>(`${this.url}/customers/top`, { params });
  }

  getTopProducts(count: number): Observable<any[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<any[]>(`${this.url}/products/top`, { params });
  }
}
