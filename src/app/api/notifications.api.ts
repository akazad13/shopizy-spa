import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from '../services/token.service';
import {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
  SendSmsRequest
} from '../types/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationsApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  private get userId(): string {
    return this.tokenService.getCurrentUserId() || '';
  }

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getPreferences(userId?: string): Observable<NotificationPreferences> {
    const targetUserId = userId || this.userId;
    return this.http.get<NotificationPreferences>(
      `${this.url}/users/${targetUserId}/notification-preferences`
    );
  }

  updatePreferences(
    preferences: UpdateNotificationPreferencesRequest,
    userId?: string
  ): Observable<NotificationPreferences> {
    const targetUserId = userId || this.userId;
    return this.http.put<NotificationPreferences>(
      `${this.url}/users/${targetUserId}/notification-preferences`,
      preferences
    );
  }

  sendSms(request: SendSmsRequest): Observable<any> {
    return this.http.post<any>(`${this.url}/notifications/sms`, request);
  }
}
