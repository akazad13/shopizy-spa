import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { Cart } from '../interfaces/cart';

@Injectable()
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

  addCartWithFirstProduct(productId: string): Observable<Cart> {
    return this.http.post<Cart>(
      this.baseUrl + '/' + this.tokenService.getCurrentUserId() + '/carts',
      {
        productId: productId
      }
    );
  }

  addProductToCart(cartId: string, productId: string): Observable<Cart> {
    return this.http.patch<Cart>(
      this.baseUrl +
        '/' +
        this.tokenService.getCurrentUserId() +
        '/carts/' +
        cartId +
        '/add-product',
      {
        productId: productId
      }
    );
  }

  updateProductQuantityToCart(
    cartId: string,
    productId: string,
    quantity: number
  ): Observable<any> {
    return this.http.patch<any>(
      this.baseUrl +
        '/' +
        this.tokenService.getCurrentUserId() +
        '/carts/' +
        cartId +
        '/update-quantity',
      {
        productId: productId,
        quantity: quantity
      }
    );
  }

  removeProductFromCart(cartId: string, productId: string): Observable<any> {
    return this.http.delete<any>(
      this.baseUrl +
        '/' +
        this.tokenService.getCurrentUserId() +
        '/carts/' +
        cartId +
        '/remove-product/' +
        productId
    );
  }
}
