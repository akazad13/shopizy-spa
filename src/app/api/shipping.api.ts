import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ShippingRateEstimate,
  ShippingRateEstimateRequest,
  ShippingTrackingInfo
} from '../types/api';

@Injectable({
  providedIn: 'root'
})
export class ShippingApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) {}

  estimateRates(
    request: ShippingRateEstimateRequest
  ): Observable<ShippingRateEstimate[]> {
    return this.http.post<ShippingRateEstimate[]>(
      `${this.url}/shipping/estimate-rates`,
      request
    );
  }

  getOrderTracking(orderId: string): Observable<ShippingTrackingInfo> {
    return this.http.get<ShippingTrackingInfo>(
      `${this.url}/orders/${orderId}/tracking`
    );
  }
}
