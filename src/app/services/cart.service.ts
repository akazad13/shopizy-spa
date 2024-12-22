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
    try {
      if (this.authService.loggedIn()) {
        this.cartApi.getCart().subscribe((cart) => {
          this.cart = cart;
          this.syncCartItems();
          this.calculateSummary();
        });
      }
    } catch (error) {
      handleError(null, error);
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  async addToCart(item: CartItem): Promise<void> {
    const existingItem = this.cartItems.find(
      (i) => i.productId === item.productId
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
      // this.updateQuantityfn(existingItem);
    } else {
      try {
        this.cartItems.push(item);
        if (this.cart == null) {
          this.cart = await firstValueFrom(
            this.cartApi.addCartWithFirstProduct(
              item.productId,
              item.color,
              item.size
            )
          );
        } else {
          this.cart = await firstValueFrom(
            this.cartApi.addProductToCart(
              this.cart.cartId,
              item.productId,
              item.color,
              item.size
            )
          );
        }
      } catch (error) {
        handleError(null, error);
      }
    }

    this.updateCart();
    this.calculateSummary();
  }

  async removeFromCart(cartItemId: string | null): Promise<void> {
    if (cartItemId != null) {
      try {
        await firstValueFrom(
          this.cartApi.removeProductFromCart(this.cart!.cartId, cartItemId)
        );

        this.cartItems = this.cartItems.filter(
          (item) => item.cartItemId !== cartItemId
        );
      } catch (error) {
        handleError(null, error);
      }
      this.updateCart();
      this.calculateSummary();
    }
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find((i) => i.cartItemId === itemId);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
  }

  getCartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  calculateSummary(): void {
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

  syncCartItems(): void {
    this.cartItems = this.cart!.cartItems.map((cartItem) =>
      this.mapCartItem(cartItem)
    );

    this.cartSubject.next([...this.cartItems]);
  }

  mapCartItem(item: any): CartItem {
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
