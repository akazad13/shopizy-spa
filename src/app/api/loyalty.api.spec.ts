import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { LoyaltyApi } from './loyalty.api';
import { LoyaltyAccountResponse } from '../types/api';
import { environment } from '../../environments/environment';

describe('LoyaltyApi', () => {
  let service: LoyaltyApi;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1.0/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoyaltyApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LoyaltyApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user loyalty account details (100 points = $1.00)', () => {
    const userId = 'user-uuid-123';
    const mockAccount: LoyaltyAccountResponse = {
      userId,
      pointsBalance: 500,
      tierName: 'Gold',
      cashEquivalentValue: 5.0
    };

    service.getLoyaltyAccount(userId).subscribe((account) => {
      expect(account.userId).toBe(userId);
      expect(account.pointsBalance).toBe(500);
      expect(account.cashEquivalentValue).toBe(5.0);
      expect(account.tierName).toBe('Gold');
    });

    const req = httpMock.expectOne(`${baseUrl}/${userId}/loyalty`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAccount);
  });

  it('should redeem loyalty points', () => {
    const userId = 'user-uuid-123';
    const pointsToRedeem = 200;

    service.redeemPoints(userId, pointsToRedeem, 'Checkout Discount').subscribe((res) => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/${userId}/loyalty/redeem`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      points: pointsToRedeem,
      description: 'Checkout Discount'
    });
    req.flush({ success: true });
  });
});
