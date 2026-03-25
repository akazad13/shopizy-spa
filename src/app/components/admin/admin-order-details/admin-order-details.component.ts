import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { OrderApi } from '../../../api/order.api';
import { OrderDetails } from '../../../interfaces/Order';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.css'
})
export class AdminOrderDetailsComponent implements OnInit {
  orderId: string | null = null;
  order: OrderDetails | null = null;
  loading: boolean = true;
  savingStatus: boolean = false;
  
  availableStatuses = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Processing' },
    { value: 3, label: 'Shipping' },
    { value: 4, label: 'Delivered' },
    { value: 5, label: 'Cancelled' },
    { value: 6, label: 'Refunded' }
  ];

  selectedStatus: string | number = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderApi: OrderApi,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrder(this.orderId);
    } else {
      this.router.navigate(['/admin/orders']);
    }
  }

  loadOrder(id: string): void {
    this.loading = true;
    this.orderApi.getGlobalOrder(id).subscribe({
      next: (res: any) => {
        this.order = res;
        this.selectedStatus = res.orderStatus;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load order details');
        this.router.navigate(['/admin/orders']);
      }
    });
  }

  updateStatus(): void {
    if (!this.orderId) return;
    this.savingStatus = true;
    
    // Convert generic text to integer string equivalent if passing numerical enum structure
    const mapped = this.mapStatusValue(this.selectedStatus);
    
    this.orderApi.updateOrderStatus(this.orderId, mapped).subscribe({
      next: () => {
        this.toast.success('Order status updated successfully');
        this.savingStatus = false;
        if (this.order) this.order.orderStatus = mapped.toString();
      },
      error: () => {
        this.toast.error('Could not update status');
        this.savingStatus = false;
      }
    });
  }
  
  // Backend expects number but often passes text for OrderStatus
  mapStatusValue(val: any): number {
    if (typeof val === 'number') return val;
    if (!isNaN(Number(val))) return Number(val);
    
    const mapping: any = {
      'Pending': 1, 'Processing': 2, 'Shipping': 3, 'Delivered': 4, 'Cancelled': 5, 'Refunded': 6
    };
    return mapping[val] || 1;
  }
}
