import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { GiftCardApi } from './gift-card.api';
import { GiftCardValidationResponse } from '../types/api';
import { environment } from '../../environments/environment';

describe('GiftCardApi', () => {
  let service: GiftCardApi;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1.0`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiftCardApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(GiftCardApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate gift card with JSON object { code }', () => {
    const giftCardCode = 'GC-2026-XYZ';
    const mockResponse: GiftCardValidationResponse = {
      code: giftCardCode,
      balance: 50.0,
      currency: 'USD',
      isValid: true
    };

    service.validateGiftCard(giftCardCode).subscribe((res) => {
      expect(res.isValid).toBeTrue();
      expect(res.balance).toBe(50.0);
    });

    const req = httpMock.expectOne(`${baseUrl}/gift-cards/validate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ code: giftCardCode });
    req.flush(mockResponse);
  });
});
