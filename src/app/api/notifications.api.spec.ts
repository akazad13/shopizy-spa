import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { NotificationsApi } from './notifications.api';
import { NotificationPreferences } from '../types/api';
import { TokenService } from '../services/token.service';
import { environment } from '../../environments/environment';

describe('NotificationsApi', () => {
  let service: NotificationsApi;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1.0`;

  const mockTokenService = {
    getCurrentUserId: () => 'test-user-id'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationsApi,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: mockTokenService }
      ]
    });

    service = TestBed.inject(NotificationsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user notification preferences', () => {
    const mockPreferences: NotificationPreferences = {
      userId: 'test-user-id',
      emailEnabled: true,
      orderUpdates: true,
      promotions: false,
      priceAlerts: true,
      restockAlerts: true
    };

    service.getPreferences('test-user-id').subscribe((prefs) => {
      expect(prefs.emailEnabled).toBeTrue();
      expect(prefs.promotions).toBeFalse();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/test-user-id/notification-preferences`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPreferences);
  });

  it('should update notification preferences via PUT', () => {
    const updatedPrefs: NotificationPreferences = {
      userId: 'test-user-id',
      emailEnabled: false,
      orderUpdates: true,
      promotions: true,
      priceAlerts: false,
      restockAlerts: true
    };

    service.updatePreferences(updatedPrefs, 'test-user-id').subscribe((res) => {
      expect(res.emailEnabled).toBeFalse();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/test-user-id/notification-preferences`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPrefs);
    req.flush(updatedPrefs);
  });
});
