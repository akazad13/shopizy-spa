import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../interfaces/Order';
import { Price } from '../interfaces/Price';
import { Address } from '../interfaces/Address';
import { OrderQueryFilters } from '../models/QueryFilters';
import { SuccessResponse } from '../interfaces/SuccessResponse';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class OrderApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;
  private get userId(): string { return this.tokenService.getCurrentUserId()!; }

  constructor(private readonly http: HttpClient, private readonly tokenService: TokenService) { }

  getOrders(filters: OrderQueryFilters): Observable<Order[]> {
    let params = new HttpParams();
    const { startDate, endDate, pageNumber, pageSize, status } =
      filters;

    if (startDate != null) {
      params = params.append('startDate', startDate);
    }

    if (endDate != null) {
      params = params.append('endDate', endDate);
    }

    if (status != null) {
      params = params.append('status', status);
    }

    params = params
      .append('pageNumber', pageNumber)
      .append('pageSize', pageSize);

    return this.http.get<Order[]>(`${this.url}/users/${this.userId}/orders`, {
      params
    });
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.url}/users/${this.userId}/orders/${orderId}`);
  }

  createOrder(
    orderItems: {
      productId: string;
      quantity: number;
      color: string;
      size: string;
    }[],
    promoCode: string,
    deliveryMethod: number,
    deliveryCharge: Price,
    shippingAddress: Address
  ): Observable<Order> {
    return this.http.post<Order>(`${this.url}/orders/checkout`, {
      promoCode: promoCode,
      deliveryMethod: deliveryMethod,
      deliveryCharge: {
        amount: deliveryCharge.amount,
        currency: deliveryCharge.currency
      },
      orderItems: orderItems,
      shippingAddress: shippingAddress
    });
  }

  cancelOrder(orderId: string, reason: string): Observable<SuccessResponse> {
    return this.http.patch<SuccessResponse>(
      `${this.url}/users/${this.userId}/orders/${orderId}/cancel`,
      {
        reason: reason
      }
    );
  }

  // --- ADMIN ENDPOINTS ---

  getAllOrders(filters: OrderQueryFilters): Observable<Order[]> {
    let params = new HttpParams();
    const { startDate, endDate, pageNumber, pageSize, status } = filters;

    if (startDate != null) params = params.append('startDate', startDate);
    if (endDate != null) params = params.append('endDate', endDate);
    if (status != null) params = params.append('status', status);
    
    params = params.append('pageNumber', pageNumber).append('pageSize', pageSize);

    return this.http.get<Order[]>(`${this.url}/admin/orders`, { params });
  }

  getGlobalOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.url}/admin/orders/${orderId}`);
  }

  updateOrderStatus(orderId: string, status: number): Observable<SuccessResponse> {
    return this.http.patch<SuccessResponse>(`${this.url}/admin/orders/${orderId}/status`, status);
  }
}
