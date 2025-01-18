import { Component, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { OrderApi } from '../../../api/order.api';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../../functions/error-handler';
import { OrderQueryFilters } from '../../../models/QueryFilters';
import { TokenService } from '../../../services/token.service';
import { Order } from '../../../interfaces/Order';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [IconComponent, NgFor, DatePipe, NgIf],
  templateUrl: './orders.component.html',
  styles: ``
})
export class OrdersComponent implements OnInit {
  filters = new OrderQueryFilters();
  orders: Order[] = [];

  constructor(
    private readonly orderApi: OrderApi,
    private readonly tokenService: TokenService
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
}
