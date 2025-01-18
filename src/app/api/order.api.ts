import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { Order } from '../interfaces/Order';
import { Price } from '../interfaces/Price';
import { Address } from '../interfaces/Address';
import { OrderQueryFilters } from '../models/QueryFilters';

@Injectable({
  providedIn: 'root'
})
export class OrderApi {
  baseUrl = environment.apiUrl + '/api/v1.0/orders/';

  constructor(private readonly http: HttpClient) {}

  getOrders(filters: OrderQueryFilters): Observable<Order[]> {
    let params = new HttpParams();
    const { customerId, startDate, endDate, pageNumber, pageSize, status } =
      filters;

    if (customerId != null) {
      params = params.append('customerId', customerId);
    }

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

    return this.http.get<Order[]>(this.baseUrl, {
      params
    });
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + orderId);
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
    return this.http.post<Order>(this.baseUrl, {
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
}
