import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { TokenService } from '../services/token.service';
import { Price } from '../interfaces/Price';

@Injectable()
export class PaymentApi {
  baseUrl = environment.apiUrl + '/api/v1.0/users';

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + '/' + productId);
  }

  postPayment(
    orderId: string,
    total: Price,
    paymentMethod: string,
    cardName: string,
    cardExpiryMonth: string,
    cardExpiryYear: string,
    lastDigits: string
  ): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + '/' + this.tokenService.getCurrentUserId() + '/payments',
      {
        orderId: orderId,
        amount: total.amount,
        currency: total.currency,
        paymentMethod: paymentMethod,
        cardName: cardName,
        cardExpiryMonth: cardExpiryMonth,
        cardExpiryYear: cardExpiryYear,
        lastDigits: lastDigits
      }
    );
  }
}
