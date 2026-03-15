import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WishlistItem } from '../interfaces/wishlist';
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
  ) {}

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.url}/users/${this.userId}/wishlist`);
  }

  addToWishlist(productId: string): Observable<any> {
    return this.http.post<any>(`${this.url}/users/${this.userId}/wishlist`, {
      productId
    });
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/users/${this.userId}/wishlist/${productId}`);
  }
}
