import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { ShippingApi } from './shipping.api';
import { ShippingMethod, ShippingTrackingInfo } from '../types/api';
import { environment } from '../../environments/environment';

describe('ShippingApi', () => {
  let service: ShippingApi;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1.0`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShippingApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ShippingApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch 3 fixed shipping methods with 0 params', () => {
    const mockMethods: ShippingMethod[] = [
      {
        carrier: 'Standard',
        serviceCode: 'STANDARD',
        serviceName: 'Standard Delivery',
        rate: 4.99,
        currency: 'USD',
        estimatedDaysMin: 3,
        estimatedDaysMax: 5
      },
      {
        carrier: 'Express',
        serviceCode: 'EXPRESS',
        serviceName: 'Express Delivery',
        rate: 9.99,
        currency: 'USD',
        estimatedDaysMin: 2,
        estimatedDaysMax: 3
      },
      {
        carrier: 'Premium',
        serviceCode: 'PREMIUM',
        serviceName: 'Premium Delivery',
        rate: 19.99,
        currency: 'USD',
        estimatedDaysMin: 1,
        estimatedDaysMax: 2
      }
    ];

    service.getShippingMethods().subscribe((methods) => {
      expect(methods.length).toBe(3);
      expect(methods[0].rate).toBe(4.99);
      expect(methods[1].rate).toBe(9.99);
      expect(methods[2].rate).toBe(19.99);
    });

    const req = httpMock.expectOne(`${baseUrl}/shipping/methods`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(mockMethods);
  });

  it('should fetch tracking info for an order', () => {
    const orderId = 'order-1234-uuid';
    const mockTracking: ShippingTrackingInfo = {
      carrier: 'Standard',
      trackingNumber: 'TRK-987654',
      status: 'InTransit',
      checkpoints: [
        {
          timestampUtc: '2026-08-29T10:00:00Z',
          location: 'Austin, TX',
          description: 'Package picked up'
        }
      ]
    };

    service.getOrderTracking(orderId).subscribe((tracking) => {
      expect(tracking.trackingNumber).toBe('TRK-987654');
      expect(tracking.status).toBe('InTransit');
      expect(tracking.checkpoints.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/orders/${orderId}/tracking`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTracking);
  });
});
