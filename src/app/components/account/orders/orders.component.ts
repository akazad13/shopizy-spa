import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { OrderApi } from '../../../api/order.api';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../../functions/error-handler';
import { OrderQueryFilters } from '../../../models/QueryFilters';
import { TokenService } from '../../../services/token.service';
import { Order } from '../../../interfaces/Order';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlertifyService } from '../../../services/alertify.service';

@Component({
  selector: 'app-orders',
  imports: [IconComponent, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styles: ``,
  schemas: [NO_ERRORS_SCHEMA]
})
export class OrdersComponent implements OnInit {
  filters = new OrderQueryFilters();
  orders: Order[] = [];

  constructor(
    private readonly orderApi: OrderApi,
    private readonly tokenService: TokenService,
    private readonly alertify: AlertifyService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getOrders();
  }

  async getOrders() {
    try {
      this.filters.customerId = this.tokenService.getCurrentUserId();
      this.filters.startDate = '2021-01-01';
      this.filters.endDate = '2024-12-31';
      this.orders = await firstValueFrom(this.orderApi.getOrders(this.filters));
    } catch (error) {
      handleError(null, error);
    }
  }

  onCancel(orderId: string): void {
    this.alertify.confirm(
      'Cancel Order!',
      'Are you sure you want to cancel this order?',
      async () => {
        await this.cancelOrder(orderId);
      },
      () => {}
    );
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await firstValueFrom(this.orderApi.cancelOrder(orderId, 'Some reason'));
      this.alertify.success('Order cancelled successfully');
      await this.getOrders();
    } catch (error) {
      handleError(null, error);
    }
  }
}
