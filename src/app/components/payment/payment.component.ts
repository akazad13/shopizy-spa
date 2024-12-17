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
import {
  PaymentMethod,
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentApi } from '../../api/payment.api';
import { finalize, firstValueFrom, Subscription } from 'rxjs';
import { handleError } from '../../functions/error-handler';
import { Price } from '../../interfaces/Price';
import { CartService } from '../../services/cart.service';
import { Order } from '../../interfaces/Order';
import { NgFor, NgIf } from '@angular/common';
import { CardInfo } from '../../interfaces/CardInfo';

@Component({
  selector: 'app-payment',
  imports: [
    StripeCardNumberComponent,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardGroupDirective,
    ReactiveFormsModule,
    IconComponent,
    FormsModule,
    NgFor,
    NgIf
  ],
  templateUrl: './payment.component.html',
  styles: `
    @media screen and (min-width: 1600px) {
      .custom-margin {
        margin-bottom: 20.35%;
      }
    }
  `,
  providers: [PaymentApi]
})
export class PaymentComponent implements OnInit, OnDestroy {
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;
  orderId!: string;
  order!: Order;
  orderSummary = {
    totalPrice: { amount: 0, currency: 'usd' },
    deliveryCharge: { amount: 0, currency: 'usd' },
    promoCode: '',
    saving: 0,
    subtotal: { amount: 0, currency: 'usd' },
    fee: { amount: 0, currency: 'usd' }
  };
  cardHolderName: string = '';

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
    public readonly cartService: CartService
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

  async pay(): Promise<void> {
    if (this.selectedPaymentOption == this.paymentOptions[0].id) {
      this.stripeService
        .createPaymentMethod({
          type: 'card',
          card: this.card.element,
          billing_details: {
            name: this.cardHolderName,
            address: {
              city: this.order.shippingAddress.city,
              country: this.order.shippingAddress.country,
              line1: this.order.shippingAddress.street,
              postal_code: this.order.shippingAddress.zipCode,
              state: this.order.shippingAddress.state
            }
          }
        })

        .subscribe(async (result) => {
          if (result.error) {
            console.log(result.error.message);
          } else {
            if (result.paymentMethod) {
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
            }
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
      console.log(data);
      this.router.navigate(['/', 'order-confirmation', data.orderId]);
    } catch (error) {
      handleError(null, error);
    }
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

  paymentOptionChange(id: string) {
    const options = this.paymentOptions.find((option) => option.id === id)!;
    this.orderSummary.totalPrice.amount =
      this.orderSummary.totalPrice.amount - this.orderSummary.fee.amount;

    this.orderSummary.fee.amount = options.price.amount;
    this.orderSummary.totalPrice.amount =
      this.orderSummary.totalPrice.amount + this.orderSummary.fee.amount;
  }
}
