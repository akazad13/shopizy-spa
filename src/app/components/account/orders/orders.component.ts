import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { OrderApi } from '../../../api/order.api';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../../functions/error-handler';
import { OrderQueryFilters } from '../../../models/QueryFilters';
import { TokenService } from '../../../services/token.service';
import { Order } from '../../../interfaces/Order';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, IconComponent, DatePipe, RouterLink, PaginationComponent],
  templateUrl: './orders.component.html',
  styles: ``,
  schemas: [NO_ERRORS_SCHEMA]
})
export class OrdersComponent implements OnInit {
  filters = new OrderQueryFilters();
  orders: Order[] = [];
  totalPages = 1;

  constructor(
    private readonly orderApi: OrderApi,
    private readonly tokenService: TokenService,
    private readonly toastService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getOrders();
  }

  async getOrders() {
    try {
      this.filters.startDate = '2021-01-01';
      this.filters.endDate = '2024-12-31';
      this.orders = await firstValueFrom(this.orderApi.getOrders(this.filters));
    } catch (error) {
      handleError(null, error);
    }
  }

  onCancel(orderId: string): void {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      this.cancelOrder(orderId);
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await firstValueFrom(this.orderApi.cancelOrder(orderId, 'Some reason'));
      this.toastService.success('Order cancelled successfully');
      await this.getOrders();
    } catch (error) {
      handleError(null, error);
    }
  }

  async onPageChange(page: number): Promise<void> {
    this.filters.pageNumber = page;
    await this.getOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
