import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { CartApi } from '../api/cart.api';
import { Cart } from '../interfaces/cart';
import { handleError } from '../functions/error-handler';

import { ProductApi } from '../api/product.api';

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
    private readonly authService: AuthService,
    private readonly productApi: ProductApi
  ) {
    this.getCartData();
  }

  getCartData(): void {
    this.cartItems = [];
    if (this.authService.loggedIn()) {
      this.cartApi.getCart().subscribe(async cart => {
        await this.applyServerCart(cart);
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
          await this.applyServerCart(cart);
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
          await this.applyServerCart(cart);
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
      await this.applyServerCart(cart);
    } catch (error) {
      this.cartItems = snapshot;
      this.emit();
      handleError(null, error);
    }
  }

  async updateItemQuantity(cartItemId: string | null, delta: number): Promise<void> {
    if (cartItemId === null) return;

    const item = this.cartItems.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    const prevQty = item.quantity;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    item.quantity = newQty;
    this.emit();

    if (!this.authService.loggedIn()) {
      this.saveToLocalStorage();
      return;
    }

    try {
      const cart = await firstValueFrom(
        this.cartApi.updateItemQuantity(cartItemId, newQty)
      );
      await this.applyServerCart(cart);
    } catch (error) {
      item.quantity = prevQty;
      this.emit();
      handleError(null, error);
    }
  }


  private async applyServerCart(cart: Cart): Promise<void> {
    if (!cart) {
      this.cartItems = [];
      this.emit();
      return;
    }

    let rawItems: any[] = [];
    if (Array.isArray(cart.cartItems)) {
      rawItems = cart.cartItems;
    } else if ((cart as any)?.cartItems?.$values && Array.isArray((cart as any).cartItems.$values)) {
      rawItems = (cart as any).cartItems.$values;
    } else if (Array.isArray(cart as any)) {
      rawItems = cart as any;
    }

    if (rawItems.length === 0) {
      this.cartItems = [];
      this.emit();
      return;
    }

    // Hydrate any items missing product details
    const missingIds = rawItems
      .filter(i => !i.product && i.productId)
      .map(i => i.productId);

    let fetchedProducts: any[] = [];
    if (missingIds.length > 0) {
      try {
        fetchedProducts = await firstValueFrom(this.productApi.getProductsByIds(missingIds));
      } catch (err) {
        console.error('Failed to batch hydrate cart products', err);
      }
    }

    const previous = this.cartItems;
    this.cartItems = rawItems.map(i => {
      const product = i.product || fetchedProducts.find(p => p.productId === i.productId);
      const fallback = previous.find(
        c => c.productId === i.productId && c.color === i.color && c.size === i.size
      );

      let image: string | undefined = undefined;
      if (product) {
        let imgs = product.productImages;
        if (imgs && (imgs as any).$values) {
          imgs = (imgs as any).$values;
        }
        if (Array.isArray(imgs) && imgs.length > 0) {
          image = typeof imgs[0] === 'string' ? imgs[0] : imgs[0]?.imageUrl;
        }
      }
      if (!image) {
        image = fallback?.image;
      }

      return {
        cartItemId: i.cartItemId ?? i.id ?? fallback?.cartItemId ?? null,
        productId: i.productId,
        image: image || 'https://res.cloudinary.com/akazad13/image/upload/v1733996785/shopizy/default-product.jpg',
        name: product?.name ?? fallback?.name ?? 'Product',
        price: Number(product?.price ?? fallback?.price ?? 0),
        discount: Number(product?.discount ?? fallback?.discount ?? 0),
        quantity: Number(i.quantity ?? 1),
        color: i.color || 'Standard',
        size: i.size || 'Standard'
      } as CartItem;
    });

    this.emit();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private emit(): void {
    this.cartSubject.next([...this.cartItems]);
  }
}
