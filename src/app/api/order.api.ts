import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { ProductQueryFilters } from '../models/ProductQueryFilters';
import { TokenService } from '../services/token.service';
import { Order } from '../interfaces/Order';
import { Price } from '../interfaces/Price';
import { Address } from '../interfaces/Address';

@Injectable()
export class OrderApi {
  baseUrl = environment.apiUrl + '/api/v1.0/users';

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getOrders(filters: ProductQueryFilters): Observable<Product[]> {
    let params = new HttpParams();
    const { name, categoryIds, averageRating, pageNumber, pageSize } = filters;

    if (name != null) {
      params = params.append('name', name);
    }

    if (categoryIds != null) {
      for (let categoryId of categoryIds) {
        params = params.append('categoryIds', categoryId);
      }
    }

    if (averageRating != null) {
      params = params.append('averageRating', averageRating);
    }

    params = params
      .append('pageNumber', pageNumber)
      .append('pageSize', pageSize);

    return this.http.get<Product[]>(this.baseUrl, {
      params
    });
  }

  getOrder(orderId: string): Observable<Product> {
    return this.http.get<Product>(
      this.baseUrl +
        '/' +
        this.tokenService.getCurrentUserId() +
        '/orders/' +
        orderId
    );
  }

  createOrder(
    orderItems: { productId: string; quantity: number }[],
    promoCode: string,
    deliveryCharge: Price,
    shippingAddress: Address
  ): Observable<Order> {
    return this.http.post<Order>(
      this.baseUrl + '/' + this.tokenService.getCurrentUserId() + '/orders/',
      {
        promoCode: promoCode,
        deliveryCharge: {
          amount: deliveryCharge.amount,
          currency: deliveryCharge.currency
        },
        orderItems: orderItems,
        shippingAddress: shippingAddress
      }
    );
  }
}
