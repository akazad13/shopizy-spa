import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditLogApi {
  private readonly url = `${environment.apiUrl}/api/v1.0/admin/audit-logs`;

  constructor(private readonly http: HttpClient) { }

  getAuditLogs(
    pageNumber: number,
    pageSize: number,
    entityName?: string,
    entityId?: string
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (entityName) {
      params = params.set('entityName', entityName);
    }
    if (entityId) {
      params = params.set('entityId', entityId);
    }

    return this.http.get<any>(this.url, { params }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (res?.$values) return res.$values;
        if (res?.items) return res.items;
        return res;
      })
    );
  }
}
