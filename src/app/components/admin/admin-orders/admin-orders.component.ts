import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderApi } from '../../../api/order.api';
import { Order } from '../../../interfaces/Order';
import { OrderQueryFilters } from '../../../models/QueryFilters';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  totalRevenue = 0;
  statusCounts = {
    Pending: 0,
    Processing: 0,
    Shipping: 0,
    Delivered: 0,
    Cancelled: 0,
    Refunded: 0
  };
  orderStatusMap: any = {
    1: 'Pending',
    2: 'Processing',
    3: 'Shipping',
    4: 'Delivered',
    5: 'Cancelled',
    6: 'Refunded'
  };

  constructor(
    private orderApi: OrderApi,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    const filters = new OrderQueryFilters();
    filters.pageNumber = 1;
    filters.pageSize = 50;

    this.orderApi.getAllOrders(filters).subscribe({
      next: (res) => {
        this.orders = Array.isArray(res)
          ? res
          : ((res as any)?.$values ??
            (res as any)?.items?.$values ??
            (res as any)?.items ??
            []);
        this.totalRevenue = this.orders.reduce(
          (sum, order) => sum + Number(order.total?.amount || 0),
          0
        );
        this.statusCounts = {
          Pending: 0,
          Processing: 0,
          Shipping: 0,
          Delivered: 0,
          Cancelled: 0,
          Refunded: 0
        };

        for (const order of this.orders) {
          const status = this.getStatusName(order.orderStatus);
          if (
            this.statusCounts[status as keyof typeof this.statusCounts] != null
          ) {
            this.statusCounts[status as keyof typeof this.statusCounts]++;
          }
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load global orders data');
        this.loading = false;
      }
    });
  }

  getStatusName(statusVal: any): string {
    return this.orderStatusMap[statusVal] || statusVal.toString();
  }
}
