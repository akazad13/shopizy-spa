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

import { map } from 'rxjs/operators';

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
      params = params.append('StartDate', startDate);
    }

    if (endDate != null) {
      params = params.append('EndDate', endDate);
    }

    if (status != null) {
      params = params.append('Status', status);
    }

    params = params
      .append('PageNumber', pageNumber)
      .append('PageSize', pageSize);

    return this.http.get<any>(`${this.url}/users/${this.userId}/orders`, {
      params
    }).pipe(
      map((res: any) => res?.$values || res || [])
    );
  }


  getOrder(orderId: string): Observable<Order> {
    return this.http.get<any>(`${this.url}/users/${this.userId}/orders/${orderId}`).pipe(
      map(order => {
        if (order && order.orderItems && order.orderItems.$values) {
          order.orderItems = order.orderItems.$values;
        }
        return order;
      })
    );
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

    if (startDate != null) params = params.append('StartDate', startDate);
    if (endDate != null) params = params.append('EndDate', endDate);
    if (status != null) params = params.append('Status', status);
    
    params = params.append('PageNumber', pageNumber).append('PageSize', pageSize);

    return this.http.get<any>(`${this.url}/admin/orders`, { params }).pipe(
      map((res: any) => res?.$values || res || [])
    );
  }


  getGlobalOrder(orderId: string): Observable<Order> {
    return this.http.get<any>(`${this.url}/admin/orders/${orderId}`).pipe(
      map(order => {
        if (order && order.orderItems && order.orderItems.$values) {
          order.orderItems = order.orderItems.$values;
        }
        return order;
      })
    );
  }



  updateOrderStatus(orderId: string, status: number): Observable<SuccessResponse> {
    return this.http.patch<SuccessResponse>(`${this.url}/admin/orders/${orderId}/status`, status);
  }

  bulkUpdateOrderStatus(orderIds: string[], status: number): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.url}/admin/orders/bulk-status`, { orderIds, status });
  }

  addShipment(orderId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/admin/orders/${orderId}/shipments`, data);
  }

  updateShipment(orderId: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/admin/orders/${orderId}/shipments`, data);
  }

  // --- USER SHIPMENTS ---

  getShipment(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.url}/users/${this.userId}/orders/${orderId}/shipments`);
  }
}
