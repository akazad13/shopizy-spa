import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardGroupDirective,
  StripeCardNumberComponent,
  StripeService
} from 'ngx-stripe';
import { IconComponent } from '../shared/icon/icon.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentApi } from '../../api/payment.api';
import { finalize, firstValueFrom, Subscription } from 'rxjs';
import { handleError } from '../../functions/error-handler';
import { Price } from '../../interfaces/Price';
import { CartService } from '../../services/cart.service';
import { OrderDetails } from '../../interfaces/Order';

import { CardInfo } from '../../interfaces/CardInfo';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    StripeCardNumberComponent,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardGroupDirective,
    ReactiveFormsModule,
    IconComponent,
    FormsModule
  ],
  templateUrl: './payment.component.html',
  styles: `
    @media screen and (min-width: 1600px) {
      .custom-margin {
        margin-bottom: 20.35%;
      }
    }
  `
})
export class PaymentComponent implements OnInit, OnDestroy {

  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;
  orderId!: string;
  order!: OrderDetails;
  orderSummary = {
    totalPrice: { amount: 0, currency: 'usd' },
    deliveryCharge: { amount: 0, currency: 'usd' },
    promoCode: '',
    saving: 0,
    subtotal: { amount: 0, currency: 'usd' },
    fee: { amount: 0, currency: 'usd' }
  };
  cardHolderName = '';

  reqInProgress = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '500',
        fontFamily:
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji"',
        fontSize: '13px',
        // lineHeight: '1.25rem',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  routeSubscription!: Subscription;

  paymentOptions = [
    {
      id: '1',
      title: 'Credit Card',
      description: 'Pay with your credit card',
      price: { amount: 0, currency: 'usd' }
    },
    {
      id: '2',
      title: 'Cash on delivery',
      description: '+$15 payment processing fee',
      price: { amount: 15, currency: 'usd' }
    }
  ];

  selectedPaymentOption = '1';

  constructor(
    private readonly stripeService: StripeService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly paymentApi: PaymentApi,
    private readonly router: Router,
    public readonly cartService: CartService,
    private readonly toastService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId') ?? '0';
    this.routeSubscription = this.activatedRoute.data.subscribe((data) => {
      this.order = data['order'];
      if (this.order != null) {
        this.calculateOrderSummary();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private normalizeCountryCode(country?: string): string {
    if (!country) return 'US';
    const c = country.trim().toUpperCase();
    const map: Record<string, string> = {
      'USA': 'US',
      'UNITED STATES': 'US',
      'UNITED STATES OF AMERICA': 'US',
      'CAN': 'CA',
      'CANADA': 'CA',
      'GBR': 'GB',
      'UK': 'GB',
      'UNITED KINGDOM': 'GB',
      'MEX': 'MX',
      'MEXICO': 'MX',
      'AUS': 'AU',
      'AUSTRALIA': 'AU',
      'DEU': 'DE',
      'GERMANY': 'DE',
      'FRA': 'FR',
      'FRANCE': 'FR'
    };
    return map[c] || (c.length === 2 ? c : 'US');
  }

  async pay(): Promise<void> {
    if (this.reqInProgress) return;
    this.reqInProgress = true;

    if (this.selectedPaymentOption == this.paymentOptions[0].id) {
      const countryCode = this.normalizeCountryCode(this.order?.shippingAddress?.country);

      this.stripeService
        .createPaymentMethod({
          type: 'card',
          card: this.card.element,
          billing_details: {
            name: this.cardHolderName,
            address: {
              city: this.order.shippingAddress.city,
              country: countryCode,
              line1: this.order.shippingAddress.street,
              postal_code: this.order.shippingAddress.zipCode,
              state: this.order.shippingAddress.state
            }
          }
        })
        .subscribe({
          next: async (result) => {
            if (result.error) {
              this.reqInProgress = false;
              console.error('[Stripe] createPaymentMethod error:', result.error.message);
              this.toastService.error(result.error.message || 'Payment method creation failed. Please verify your card details.');
            } else if (result.paymentMethod) {
              const cardInfo: CardInfo = {
                cardName: this.cardHolderName,
                cardExpiryMonth: result.paymentMethod.card!.exp_month,
                cardExpiryYear: result.paymentMethod.card!.exp_year,
                lastDigits: result.paymentMethod.card!.last4
              };

              await this.postPayment(
                this.orderSummary.totalPrice.amount,
                this.orderSummary.totalPrice.currency,
                'Card',
                result.paymentMethod.id,
                cardInfo
              );
            } else {
              this.reqInProgress = false;
            }
          },
          error: (err) => {
            this.reqInProgress = false;
            console.error('[Stripe] Unexpected error:', err);
            this.toastService.error('An unexpected error occurred during payment processing.');
          }
        });
    } else {
      await this.postPayment(
        this.orderSummary.totalPrice.amount,
        this.orderSummary.totalPrice.currency,
        'COD',
        null,
        null
      );
    }
  }

  async postPayment(
    amount: number,
    currency: string,
    paymentMethod: string,
    paymentMethodId: string | null,
    cardInfo: CardInfo | null
  ): Promise<void> {
    const total: Price = {
      amount,
      currency
    };

    this.reqInProgress = true;
    try {
      const data = await firstValueFrom(
        this.paymentApi
          .postPayment(
            this.orderId,
            total,
            paymentMethod,
            paymentMethodId,
            cardInfo
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      console.log('[Payment] Success:', data);
      this.router.navigate(['/', 'order-confirmation', this.orderId]);
    } catch (error: any) {
      console.error('[Payment] postPayment error:', error?.error || error);
      handleError(null, error);
    }
  }
  calculateOrderSummary(): void {
    if (!this.order) return;

    let subtotal = 0;
    let saving = 0;

    (this.order.orderItems || []).forEach((item) => {
      const discount = item.discount || 0;
      const unitPrice = item.unitPrice?.amount ?? Number(item.unitPrice) ?? 0;
      const quantity = item.quantity || 1;
      subtotal += unitPrice * quantity;
      saving += ((unitPrice * discount) / 100) * quantity;
    });

    const deliveryCost = this.order.deliveryCharge?.amount ?? Number(this.order.deliveryCharge) ?? 0;
    const fee = this.selectedPaymentOption === '2' ? (this.paymentOptions[1]?.price?.amount || 0) : 0;

    this.orderSummary.subtotal.amount = subtotal;
    this.orderSummary.saving = saving;
    this.orderSummary.deliveryCharge = {
      amount: deliveryCost,
      currency: this.order.deliveryCharge?.currency || 'usd'
    };
    this.orderSummary.fee = {
      amount: fee,
      currency: 'usd'
    };
    this.orderSummary.totalPrice.amount = Math.max(0, Math.round((subtotal + deliveryCost - saving + fee) * 100) / 100);
    this.orderSummary.totalPrice.currency = this.order.deliveryCharge?.currency || 'usd';
  }

  paymentOptionChange(id: string) {
    this.selectedPaymentOption = id;
    this.calculateOrderSummary();
  }
}
