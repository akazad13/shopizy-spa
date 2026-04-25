import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardApi } from '../../../api/dashboard.api';
import { OrderApi } from '../../../api/order.api';
import { OrderQueryFilters } from '../../../models/QueryFilters';
import { firstValueFrom } from 'rxjs';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  metrics: any = null;
  loading = true;

  recentOrders: any[] = [];

  constructor(
    private dashboardApi: DashboardApi,
    private orderApi: OrderApi
  ) {}

  async ngOnInit(): Promise<void> {
    this.dashboardApi.getDashboardMetrics().subscribe({
      next: (res) => {
        this.metrics = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    try {
      const filters = new OrderQueryFilters();
      filters.pageSize = 5;
      const orders = await firstValueFrom(this.orderApi.getAllOrders(filters));
      this.recentOrders = orders.map((o) => ({
        id: o.orderId.substring(0, 8),
        amount: o.total.amount,
        status: o.orderStatus,
        currency: o.total.currency
      }));
    } catch (e) {
      console.error('Failed to load recent orders', e);
    }
  }
}
