import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ShippingMethod,
  ShippingTrackingInfo
} from '../types/api';

@Injectable({
  providedIn: 'root'
})
export class ShippingApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) {}

  getShippingMethods(): Observable<ShippingMethod[]> {
    return this.http.get<ShippingMethod[]>(`${this.url}/shipping/methods`);
  }

  getOrderTracking(orderId: string): Observable<ShippingTrackingInfo> {
    return this.http.get<ShippingTrackingInfo>(
      `${this.url}/orders/${orderId}/tracking`
    );
  }
}
