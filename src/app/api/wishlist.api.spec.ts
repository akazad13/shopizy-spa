import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { WishlistApi } from './wishlist.api';
import { Wishlist } from '../interfaces/wishlist';
import { TokenService } from '../services/token.service';
import { environment } from '../../environments/environment';

describe('WishlistApi', () => {
  let service: WishlistApi;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1.0`;

  const mockTokenService = {
    getCurrentUserId: () => 'user-123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WishlistApi,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: mockTokenService }
      ]
    });

    service = TestBed.inject(WishlistApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user wishlist', () => {
    const mockWishlist: Wishlist = {
      wishlistId: 'wishlist-123',
      userId: 'user-123',
      wishlistItems: []
    };

    service.getWishlist().subscribe((res) => {
      expect(res.wishlistId).toBe('wishlist-123');
    });

    const req = httpMock.expectOne(`${baseUrl}/users/user-123/wishlist`);
    expect(req.request.method).toBe('GET');
    req.flush(mockWishlist);
  });

  it('should remove item via DELETE /users/{userId}/wishlist/items/{productId}', () => {
    const productId = 'prod-456';

    service.removeFromWishlist(productId).subscribe((res) => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/user-123/wishlist/items/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
