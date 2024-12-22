import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { CartApi } from '../api/cart.api';
import { Cart } from '../interfaces/cart';
import { handleError } from '../functions/error-handler';

export interface CartItem {
  cartItemId: string | null;
  productId: string;
  image: string | undefined;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  color: string;
  size: string;
}

export interface CartSummary {
  totalItems: number;
  subTotal: number;
  saving: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cart: Cart | null = null;
  private readonly cartSubject = new BehaviorSubject<CartItem[]>([]);

  cartSummary: CartSummary = {
    totalItems: 0,
    subTotal: 0,
    saving: 0,
    total: 0
  };

  constructor(
    private readonly cartApi: CartApi,
    private readonly authService: AuthService
  ) {
    this.getCartData();
  }

  getCartData(): void {
    try {
      this.cartItems = [];
      if (this.authService.loggedIn()) {
        this.cartApi.getCart().subscribe(async (cart) => {
          this.cart = cart;
          this.syncCartToCartItems();

          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            const cartItems = JSON.parse(savedCart);
            for (const cartItem of cartItems) {
              await this.addToCart(cartItem);
            }
            localStorage.removeItem('cart');
          }
        });
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          this.cartItems = JSON.parse(savedCart);
          this.calculateSummary();
          this.cartSubject.next([...this.cartItems]);
        }
      }
    } catch (error) {
      handleError(null, error);
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  async addToCart(item: CartItem): Promise<void> {
    const existingItem = this.cartItems.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.color === item.color &&
        cartItem.size === item.size
    );

    if (existingItem) {
      if (this.authService.loggedIn()) {
        if (
          await this.updateProductQuantity(
            existingItem.productId,
            existingItem.cartItemId!,
            existingItem.quantity + item.quantity
          )
        ) {
          existingItem.quantity += item.quantity;
          this.calculateSummary();
          this.cartSubject.next([...this.cartItems]);
        }
      } else {
        existingItem.quantity += item.quantity;
        localStorage.setItem('cart', JSON.stringify([...this.cartItems]));
        this.calculateSummary();
        this.cartSubject.next([...this.cartItems]);
      }
    } else {
      if (this.authService.loggedIn()) {
        if (await this.addProductToCart(item)) {
          this.syncCartToCartItems();
        }
      } else {
        item.cartItemId = Date.now().toString();
        this.cartItems.push(item);
        localStorage.setItem('cart', JSON.stringify([...this.cartItems]));
        this.calculateSummary();
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }

  async removeFromCart(cartItemId: string | null): Promise<void> {
    if (cartItemId != null) {
      if (await this.removeProductFromCart(cartItemId)) {
        this.cartItems = this.cartItems.filter(
          (item) => item.cartItemId !== cartItemId
        );
        this.calculateSummary();
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }

  private async removeProductFromCart(cartItemId: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.cartApi.removeProductFromCart(this.cart!.cartId, cartItemId)
      );
      return true;
    } catch (error) {
      handleError(null, error);
      return false;
    }
  }

  private async addProductToCart(item: CartItem): Promise<boolean> {
    try {
      this.cartItems.push(item);

      this.cart = await firstValueFrom(
        this.cartApi.addProductToCart(
          this.cart!.cartId,
          item.productId,
          item.color,
          item.size,
          item.quantity
        )
      );
      return true;
    } catch (error) {
      handleError(null, error);
      return false;
    }
  }

  private async updateProductQuantity(
    productId: string,
    cartItemId: string,
    quantity: number
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.cartApi.updateProductQuantityToCart(
          this.cart!.cartId,
          cartItemId,
          productId,
          quantity
        )
      );
      this.cart!.cartItems.find((cartItem) => cartItem.productId === productId)!
        .quantity++;
      return true;
    } catch (error) {
      handleError(null, error);
      return false;
    }
  }

  private syncCartToCartItems(): void {
    this.cartItems = this.cart!.cartItems.map((cartItem) =>
      this.mapCartItem(cartItem)
    );
    this.calculateSummary();
    this.cartSubject.next([...this.cartItems]);
  }

  private calculateSummary(): void {
    this.cartSummary.subTotal = 0;
    this.cartItems.forEach((item) => {
      this.cartSummary.subTotal += item.price * item.quantity;
      this.cartSummary.saving +=
        ((item.price * item.discount) / 100) * item.quantity;
    });

    this.cartSummary.totalItems = this.cartItems.length;
    this.cartSummary.total =
      this.cartSummary.subTotal - this.cartSummary.saving;
  }

  private mapCartItem(item: any): CartItem {
    return {
      cartItemId: item.cartItemId,
      productId: item.productId,
      image: item.product.productImages[0],
      name: item.product.name,
      price: item.product.price,
      discount: item.product.discount,
      quantity: item.quantity,
      color: item.color,
      size: item.size
    };
  }
}
