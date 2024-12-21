import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { Order } from '../interfaces/Order';
import { Price } from '../interfaces/Price';
import { Address } from '../interfaces/Address';

@Injectable({
  providedIn: 'root'
})
export class OrderApi {
  baseUrl = environment.apiUrl + '/api/v1.0/orders/';

  constructor(private readonly http: HttpClient) {}

  getOrders(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
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
