import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { WishlistApi } from '../api/wishlist.api';
import { WishlistItem } from '../interfaces/wishlist';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product';
import { ProductApi } from '../api/product.api';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: WishlistItem[] = [];
  private wishlistExists = false;
  private loadPromise?: Promise<void>;
  private readonly wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private readonly wishlistApi: WishlistApi,
    private readonly authService: AuthService,
    private readonly productApi: ProductApi
  ) {
    this.loadWishlist();
  }

  public loadWishlist(): Promise<void> {
    this.loadPromise = (async () => {
      if (this.authService.loggedIn()) {
        try {
          const response = await firstValueFrom(this.wishlistApi.getWishlist());
          let items = response?.wishlistItems || [];
          
          // Hydrate all missing items in a batch if needed
          const missingIds = items.filter(i => !i.product).map(i => i.productId);
          
          if (missingIds.length > 0) {
            try {
              const products = await firstValueFrom(this.productApi.getProductsByIds(missingIds));
              items = items.map(item => {
                const product = products.find(p => p.productId === item.productId);
                if (product) {
                  item.product = product;
                }
                return item;
              });
            } catch (e) {
              console.error('Failed to batch hydrate products', e);
            }
          }

          this.wishlistItems = items.filter(i => !!i.product);
          this.wishlistExists = true;
          this.emit();
        } catch (error: any) {
          this.wishlistExists = false;
          console.error('Failed to load wishlist from server', error);
          this.loadFromLocalStorage();
        }
      } else {
        this.wishlistExists = false;
        this.loadFromLocalStorage();
      }
    })();
    return this.loadPromise;
  }

  private loadFromLocalStorage() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlistItems = JSON.parse(saved);
      this.emit();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  async toggleWishlist(product: Product): Promise<void> {
    const isExist = this.isInWishlist(product.productId);

    if (isExist) {
      await this.removeFromWishlist(product.productId);
    } else {
      await this.addToWishlist(product);
    }
  }

  private async addToWishlist(product: Product): Promise<void> {
    const item: WishlistItem = {
      productId: product.productId,
      product: product
    };

    if (this.authService.loggedIn()) {
      if (this.loadPromise) {
        await this.loadPromise;
      }
      try {
        if (!this.wishlistExists) {
          await firstValueFrom(this.wishlistApi.createWishlist());
          this.wishlistExists = true;
        }
        await firstValueFrom(this.wishlistApi.addToWishlist(product.productId));
      } catch (error: any) {
        // If operation failed (e.g. wishlist did not exist on server), attempt auto-creation once and retry
        try {
          await firstValueFrom(this.wishlistApi.createWishlist());
          this.wishlistExists = true;
          await firstValueFrom(this.wishlistApi.addToWishlist(product.productId));
        } catch (retryErr) {
          console.error('Failed to add to wishlist on server', retryErr);
        }
      }
    }

    if (!this.isInWishlist(product.productId)) {
      this.wishlistItems.push(item);
    }
    this.saveToLocalStorage();
    this.emit();
  }

  private async removeFromWishlist(productId: string): Promise<void> {
    if (this.authService.loggedIn()) {
      if (this.loadPromise) {
        await this.loadPromise;
      }
      try {
        await firstValueFrom(this.wishlistApi.removeFromWishlist(productId));
      } catch (error) {
        console.error('Failed to remove from wishlist on server', error);
      }
    }

    this.wishlistItems = this.wishlistItems.filter(i => i.productId !== productId);
    this.saveToLocalStorage();
    this.emit();
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems.some(i => i.productId === productId);
  }

  private emit() {
    this.wishlistSubject.next([...this.wishlistItems]);
  }
}
