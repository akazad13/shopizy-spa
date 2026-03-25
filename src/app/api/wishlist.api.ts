import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Wishlist } from '../interfaces/wishlist';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;
  private get userId(): string { return this.tokenService.getCurrentUserId()!; }

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) { }

  getWishlist(): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.url}/users/${this.userId}/wishlist`);
  }

  addToWishlist(productId: string): Observable<any> {
    return this.http.patch<any>(`${this.url}/users/${this.userId}/wishlist`, {
      productId: productId,
      action: 'Add'
    });
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.patch<any>(`${this.url}/users/${this.userId}/wishlist`, {
      productId: productId,
      action: 'Remove'
    });
  }

  createWishlist(): Observable<any> {
    return this.http.post<any>(`${this.url}/users/${this.userId}/wishlist`, {});
  }

  getPublicWishlist(wishlistId: string): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.url}/wishlists/${wishlistId}`);
  }

  updateWishlistSettings(name: string, isPublic: boolean): Observable<Wishlist> {
    return this.http.patch<Wishlist>(`${this.url}/users/${this.userId}/wishlist/settings`, {
      name: name,
      isPublic: isPublic
    });
  }
}
