import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  // Mock Data since the API endpoint is pending backend implementation
  metrics = {
    totalRevenue: 15430.50,
    totalOrders: 124,
    newCustomers: 12,
    outOfStockProducts: 3
  };

  recentOrders = [
    { id: 'ORD-9821', date: new Date(), amount: 120.50, status: 'Processing' },
    { id: 'ORD-9820', date: new Date(Date.now() - 86400000), amount: 840.00, status: 'Shipped' },
    { id: 'ORD-9819', date: new Date(Date.now() - 172800000), amount: 45.99, status: 'Delivered' }
  ];

  ngOnInit(): void {
    // In the future this will be: `this.adminApi.getDashboardMetrics().subscribe(...)`
  }
}
