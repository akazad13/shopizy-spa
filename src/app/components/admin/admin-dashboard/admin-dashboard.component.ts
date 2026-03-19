import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardApi } from '../../../api/dashboard.api';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  metrics: any = null;
  loading = true;

  recentOrders = [
    { id: 'ORD-9821', date: new Date(), amount: 120.50, status: 'Processing' },
    { id: 'ORD-9820', date: new Date(Date.now() - 86400000), amount: 840.00, status: 'Shipped' },
    { id: 'ORD-9819', date: new Date(Date.now() - 172800000), amount: 45.99, status: 'Delivered' }
  ];

  constructor(private dashboardApi: DashboardApi) {}

  ngOnInit(): void {
    this.dashboardApi.getDashboardMetrics().subscribe({
      next: (res) => {
        this.metrics = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
