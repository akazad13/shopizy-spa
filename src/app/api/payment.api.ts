import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { Price } from '../interfaces/Price';
import { CardInfo } from '../interfaces/CardInfo';

@Injectable({ providedIn: 'root' })
export class PaymentApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;
  private get userId(): string { return this.tokenService.getCurrentUserId()!; }

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) { }

  postPayment(
    orderId: string,
    total: Price,
    paymentMethod: string,
    paymentMethodId: string | null,
    cardInfo: CardInfo | null
  ): Observable<any> {
    const idempotencyKey = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });

    return this.http.post<any>(
      `${this.url}/users/${this.userId}/payments`,
      {
        orderId: orderId,
        amount: total.amount,
        currency: total.currency,
        paymentMethod: paymentMethod,
        paymentMethodId: paymentMethodId,
        cardInfo: cardInfo
      },
      {
        headers: { 'Idempotency-Key': idempotencyKey }
      }
    );
  }
}
