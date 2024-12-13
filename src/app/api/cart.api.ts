import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { Cart } from '../interfaces/cart';
import { SuccessResponse } from '../interfaces/SuccessResponse';

@Injectable({ providedIn: 'root' })
export class CartApi {
  baseUrl = environment.apiUrl + '/api/v1.0/users';

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(
      this.baseUrl + '/' + this.tokenService.getCurrentUserId() + '/carts'
    );
  }

  addCartWithFirstProduct(
    productId: string,
    color: string,
    size: string
  ): Observable<Cart> {
    return this.http.post<Cart>(
      this.baseUrl + '/' + this.tokenService.getCurrentUserId() + '/carts',
      {
        productId: productId,
        color: color,
        size: size
      }
    );
  }

  addProductToCart(
    cartId: string,
    productId: string,
    color: string,
    size: string
  ): Observable<Cart> {
    return this.http.patch<Cart>(
      this.baseUrl +
        '/' +
        this.tokenService.getCurrentUserId() +
        '/carts/' +
        cartId +
        '/add-product',
      {
        productId: productId,
        color: color,
        size: size
      }
    );
  }

  updateProductQuantityToCart(
    cartId: string,
    itemId: string,
    productId: string,
    quantity: number
  ): Observable<any> {
    return this.http.patch<SuccessResponse>(
      this.baseUrl +
        '/' +
        this.tokenService.getCurrentUserId() +
        '/carts/' +
        cartId +
        '/items/' +
        itemId,
      {
        productId: productId,
        quantity: quantity
      }
    );
  }

  removeProductFromCart(cartId: string, itemId: string): Observable<any> {
    return this.http.delete<SuccessResponse>(
      this.baseUrl +
        '/' +
        this.tokenService.getCurrentUserId() +
        '/carts/' +
        cartId +
        '/items/' +
        itemId
    );
  }
}
