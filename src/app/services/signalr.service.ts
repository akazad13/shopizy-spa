import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

export interface OrderStatusUpdateEvent {
  orderId: string;
  status: string;
  timestampUtc: string;
}

export interface MetricUpdateEvent {
  metricType: string;
  data: any;
  timestampUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private orderHubConnection: signalR.HubConnection | null = null;
  private adminHubConnection: signalR.HubConnection | null = null;

  private readonly orderStatusUpdatesSubject = new Subject<OrderStatusUpdateEvent>();
  readonly orderStatusUpdates$: Observable<OrderStatusUpdateEvent> =
    this.orderStatusUpdatesSubject.asObservable();

  private readonly metricUpdatesSubject = new Subject<MetricUpdateEvent>();
  readonly metricUpdates$: Observable<MetricUpdateEvent> =
    this.metricUpdatesSubject.asObservable();

  private readonly orderHubConnectedSubject = new BehaviorSubject<boolean>(false);
  readonly orderHubConnected$: Observable<boolean> = this.orderHubConnectedSubject.asObservable();

  constructor(private readonly tokenService: TokenService) {}

  async startOrderHub(): Promise<void> {
    if (this.orderHubConnection && this.orderHubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      const baseUrl = environment.apiUrl.replace(/\/api\/v1\.0\/?$/, '');
      const hubUrl = `${baseUrl}/hubs/orders`;

      this.orderHubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => this.tokenService.getToken() || ''
        })
        .withAutomaticReconnect()
        .build();

      this.orderHubConnection.on(
        'ReceiveOrderStatusUpdate',
        (data: OrderStatusUpdateEvent) => {
          this.orderStatusUpdatesSubject.next(data);
        }
      );

      this.orderHubConnection.onreconnected(() => {
        this.orderHubConnectedSubject.next(true);
      });

      this.orderHubConnection.onclose(() => {
        this.orderHubConnectedSubject.next(false);
      });

      await this.orderHubConnection.start();
      this.orderHubConnectedSubject.next(true);
    } catch (err) {
      console.warn('SignalR Orders Hub connection failed:', err);
      this.orderHubConnectedSubject.next(false);
    }
  }

  async stopOrderHub(): Promise<void> {
    if (this.orderHubConnection) {
      try {
        await this.orderHubConnection.stop();
      } catch (err) {
        console.error('Error stopping Order Hub:', err);
      }
      this.orderHubConnection = null;
      this.orderHubConnectedSubject.next(false);
    }
  }

  async startAdminHub(): Promise<void> {
    if (this.adminHubConnection && this.adminHubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      const baseUrl = environment.apiUrl.replace(/\/api\/v1\.0\/?$/, '');
      const hubUrl = `${baseUrl}/hubs/admin-dashboard`;

      this.adminHubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => this.tokenService.getToken() || ''
        })
        .withAutomaticReconnect()
        .build();

      this.adminHubConnection.on(
        'ReceiveMetricUpdate',
        (data: MetricUpdateEvent) => {
          this.metricUpdatesSubject.next(data);
        }
      );

      await this.adminHubConnection.start();
    } catch (err) {
      console.warn('SignalR Admin Hub connection failed:', err);
    }
  }

  async stopAdminHub(): Promise<void> {
    if (this.adminHubConnection) {
      try {
        await this.adminHubConnection.stop();
      } catch (err) {
        console.error('Error stopping Admin Hub:', err);
      }
      this.adminHubConnection = null;
    }
  }
}
