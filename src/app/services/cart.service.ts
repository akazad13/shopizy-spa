import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
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
  private readonly cartSubject = new BehaviorSubject<CartItem[]>([]);

  readonly cartSummary$ = this.cartSubject.pipe(
    map(items => {
      const subTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const saving = items.reduce((s, i) => s + (i.price * i.discount / 100) * i.quantity, 0);
      return { totalItems: items.length, subTotal, saving, total: subTotal - saving } as CartSummary;
    })
  );

  constructor(
    private readonly cartApi: CartApi,
    private readonly authService: AuthService
  ) {
    this.getCartData();
  }

  getCartData(): void {
    this.cartItems = [];
    if (this.authService.loggedIn()) {
      this.cartApi.getCart().subscribe(async cart => {
        this.applyServerCart(cart);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const guestItems: CartItem[] = JSON.parse(savedCart);
          for (const item of guestItems) {
            await this.addToCart(item);
          }
          localStorage.removeItem('cart');
        }
      });
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.emit();
      }
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  async addToCart(item: CartItem): Promise<void> {
    const existing = this.cartItems.find(
      c => c.productId === item.productId && c.color === item.color && c.size === item.size
    );

    if (existing) {
      if (this.authService.loggedIn()) {
        if (existing.cartItemId === null) return;
        const prevQty = existing.quantity;
        existing.quantity += item.quantity;
        this.emit();
        try {
          const cart = await firstValueFrom(
            this.cartApi.updateItemQuantity(existing.cartItemId, existing.quantity)
          );
          this.applyServerCart(cart);
        } catch (error) {
          existing.quantity = prevQty;
          this.emit();
          handleError(null, error);
        }
      } else {
        existing.quantity += item.quantity;
        this.saveToLocalStorage();
        this.emit();
      }
    } else {
      if (this.authService.loggedIn()) {
        this.cartItems.push(item);
        this.emit();
        try {
          const cart = await firstValueFrom(
            this.cartApi.addItem(item.productId, item.color, item.size, item.quantity)
          );
          this.applyServerCart(cart);
        } catch (error) {
          this.cartItems = this.cartItems.filter(
            c => !(c.productId === item.productId && c.color === item.color && c.size === item.size)
          );
          this.emit();
          handleError(null, error);
        }
      } else {
        item.cartItemId = Date.now().toString();
        this.cartItems.push(item);
        this.saveToLocalStorage();
        this.emit();
      }
    }
  }

  async removeFromCart(cartItemId: string | null): Promise<void> {
    if (cartItemId === null) return;

    const snapshot = [...this.cartItems];
    this.cartItems = this.cartItems.filter(i => i.cartItemId !== cartItemId);
    this.emit();

    if (!this.authService.loggedIn()) {
      this.saveToLocalStorage();
      return;
    }

    try {
      const cart = await firstValueFrom(this.cartApi.removeItem(cartItemId));
      this.applyServerCart(cart);
    } catch (error) {
      this.cartItems = snapshot;
      this.emit();
      handleError(null, error);
    }
  }

  private applyServerCart(cart: Cart): void {
    const previous = this.cartItems;
    this.cartItems = cart.cartItems
      .map(i => {
        const fallback = previous.find(
          c => c.productId === i.productId && c.color === i.color && c.size === i.size
        );
        if (!i.product && !fallback) return null;
        return {
          cartItemId: i.cartItemId,
          productId: i.productId,
          image: i.product?.productImages?.[0] ?? fallback?.image,
          name: i.product?.name ?? fallback?.name ?? '',
          price: i.product?.price ?? fallback?.price ?? 0,
          discount: i.product?.discount ?? fallback?.discount ?? 0,
          quantity: i.quantity,
          color: i.color,
          size: i.size
        } as CartItem;
      })
      .filter((i): i is CartItem => i !== null);
    this.emit();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private emit(): void {
    this.cartSubject.next([...this.cartItems]);
  }
}
