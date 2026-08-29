import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { Cart } from '../interfaces/cart';

@Injectable({ providedIn: 'root' })
export class CartApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;
  private get userId(): string {
    return this.tokenService.getCurrentUserId()!;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.url}/users/${this.userId}/cart`);
  }

  addItem(
    productId: string,
    color?: string,
    size?: string,
    quantity: number = 1,
    variantId?: string
  ): Observable<Cart> {
    return this.http.patch<Cart>(`${this.url}/users/${this.userId}/cart/items`, {
      productId,
      variantId,
      color,
      size,
      quantity
    });
  }

  updateItemQuantity(itemId: string, quantity: number): Observable<Cart> {
    return this.http.patch<Cart>(
      `${this.url}/users/${this.userId}/cart/items/${itemId}`,
      { quantity }
    );
  }

  removeItem(itemId: string): Observable<Cart> {
    return this.http.delete<Cart>(
      `${this.url}/users/${this.userId}/cart/items/${itemId}`
    );
  }
}
