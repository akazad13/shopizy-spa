import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { WishlistApi } from '../api/wishlist.api';
import { WishlistItem } from '../interfaces/wishlist';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: WishlistItem[] = [];
  private readonly wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private readonly wishlistApi: WishlistApi,
    private readonly authService: AuthService
  ) {
    this.loadWishlist();
  }

  private async loadWishlist() {
    if (this.authService.loggedIn()) {
      try {
        const items = await firstValueFrom(this.wishlistApi.getWishlist());
        this.wishlistItems = items;
        this.emit();
      } catch (error) {
        console.error('Failed to load wishlist from server', error);
        this.loadFromLocalStorage();
      }
    } else {
      this.loadFromLocalStorage();
    }
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
      try {
        await firstValueFrom(this.wishlistApi.addToWishlist(product.productId));
      } catch (error) {
        console.error('Failed to add to wishlist on server', error);
      }
    }

    this.wishlistItems.push(item);
    this.saveToLocalStorage();
    this.emit();
  }

  private async removeFromWishlist(productId: string): Promise<void> {
    if (this.authService.loggedIn()) {
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
