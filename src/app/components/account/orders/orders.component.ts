import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { OrderApi } from '../../../api/order.api';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../../functions/error-handler';
import { OrderQueryFilters } from '../../../models/QueryFilters';
import { TokenService } from '../../../services/token.service';
import { Order, OrderStatus } from '../../../interfaces/Order';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { UserApi } from '../../../api/user.api';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, IconComponent, DatePipe, RouterLink, PaginationComponent, SkeletonLoaderComponent],
  templateUrl: './orders.component.html',
  styles: ``,
  schemas: [NO_ERRORS_SCHEMA]
})
export class OrdersComponent implements OnInit {
  filters = new OrderQueryFilters();
  orders: Order[] = [];
  totalPages = 1;
  loading = true;

  constructor(
    private readonly orderApi: OrderApi,
    private readonly tokenService: TokenService,
    private readonly toastService: ToastService,
    private readonly userApi: UserApi
  ) {}

  async ngOnInit(): Promise<void> {
    const now = new Date();
    this.filters.endDate = this.formatDate(now);
    this.filters.startDate = this.formatDate(new Date(now.getFullYear(), 0, 1)); // Default to this year
    await this.getOrders();
  }

  async getOrders() {
    this.loading = true;
    // Fetch pagination metadata separately so a failure here never prevents
    // the orders list from loading.
    try {
      const userId = this.tokenService.getCurrentUserId();
      if (userId) {
        const user = await firstValueFrom(this.userApi.getUser(userId));
        this.totalPages = Math.ceil((user.totalOrders || 0) / this.filters.pageSize);
      }
    } catch {
      // totalOrders unavailable; leave totalPages at its current value.
    }

    try {
      this.orders = await firstValueFrom(this.orderApi.getOrders(this.filters));
    } catch (error) {
      handleError(null, error);
    } finally {
      this.loading = false;
    }
  }

  onFilterChange(event: Event) {
    const statusStr = (event.target as HTMLSelectElement).value;
    this.filters.pageNumber = 1;
    if (statusStr === 'All orders') {
      this.filters.status = null;
    } else {
      this.filters.status = OrderStatus[statusStr as keyof typeof OrderStatus] as unknown as OrderStatus;
    }
    this.getOrders();
  }

  onDurationChange(event: Event) {
    const duration = (event.target as HTMLSelectElement).value;
    this.filters.pageNumber = 1;
    const now = new Date();
    switch (duration) {
      case 'this week':
        this.filters.startDate = this.formatDate(new Date(now.setDate(now.getDate() - 7)));
        this.filters.endDate = this.formatDate(new Date());
        break;
      case 'this month':
        this.filters.startDate = this.formatDate(new Date(now.setMonth(now.getMonth() - 1)));
        this.filters.endDate = this.formatDate(new Date());
        break;
      case 'last 3 months':
        this.filters.startDate = this.formatDate(new Date(now.setMonth(now.getMonth() - 3)));
        this.filters.endDate = this.formatDate(new Date());
        break;
      case 'last 6 months':
        this.filters.startDate = this.formatDate(new Date(now.setMonth(now.getMonth() - 6)));
        this.filters.endDate = this.formatDate(new Date());
        break;
      case 'this year':
        this.filters.startDate = this.formatDate(new Date(now.getFullYear(), 0, 1));
        this.filters.endDate = this.formatDate(new Date());
        break;
    }
    this.getOrders();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onCancel(orderId: string): void {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      this.cancelOrder(orderId);
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await firstValueFrom(this.orderApi.cancelOrder(orderId, 'User requested cancellation'));
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
