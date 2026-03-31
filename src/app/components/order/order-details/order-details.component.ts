import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent } from '../../shared/icon/icon.component';

import { OrderDetails } from '../../../interfaces/Order';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './order-details.component.html',
  styles: ``
})
export class OrderDetailsComponent implements OnInit {
  orderId!: string;
  order!: OrderDetails;
  routeSubscription!: Subscription;

  orderSummary = {
    totalPrice: { amount: 0, currency: 'usd' },
    deliveryCharge: { amount: 0, currency: 'usd' },
    promoCode: '',
    saving: 0,
    subtotal: { amount: 0, currency: 'usd' },
    fee: { amount: 0, currency: 'usd' }
  };

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId') ?? '0';
    this.routeSubscription = this.activatedRoute.data.subscribe((data) => {
      this.order = data['order'];
      if (this.order != null) {
        this.calculateOrderSummary();
      }
    });
  }

  calculateOrderSummary(): void {
    this.order.orderItems.forEach((item) => {
      this.orderSummary.subtotal.amount +=
        item.unitPrice.amount * item.quantity;
      this.orderSummary.saving +=
        ((item.unitPrice.amount * item.discount) / 100) * item.quantity;
    });

    this.orderSummary.totalPrice.amount =
      this.orderSummary.subtotal.amount +
      this.order.deliveryCharge.amount -
      this.orderSummary.saving;

    this.orderSummary.totalPrice.currency = this.orderSummary.subtotal.currency;
    this.orderSummary.deliveryCharge = this.order.deliveryCharge;
  }

  getStatusStep(): number {
    switch (this.order.orderStatus) {
      case 'Pending':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipping':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  }
}
