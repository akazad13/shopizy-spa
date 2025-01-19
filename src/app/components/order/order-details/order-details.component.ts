import { Component } from '@angular/core';
import { OrderDetails } from '../../../interfaces/Order';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [NgFor, RouterLink],
  templateUrl: './order-details.component.html',
  styles: ``
})
export class OrderDetailsComponent {
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
}
