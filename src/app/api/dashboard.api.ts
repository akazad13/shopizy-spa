import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) {}

  getDashboardMetrics(): Observable<any> {
    return this.http.get<any>(`${this.url}/admin/dashboard/metrics`);
  }
}
