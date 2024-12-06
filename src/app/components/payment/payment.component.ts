import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardGroupDirective,
  StripeCardNumberComponent,
  StripeService
} from 'ngx-stripe';
import { IconComponent } from '../shared/icon/icon.component';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentApi } from '../../api/payment.api';
import { finalize, firstValueFrom } from 'rxjs';
import { handleError } from '../../functions/error-handler';
import { Price } from '../../interfaces/Price';

@Component({
  selector: 'app-payment',
  imports: [
    StripeCardNumberComponent,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardGroupDirective,
    ReactiveFormsModule,
    IconComponent
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
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;
  orderId!: string;

  reqInProgress = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '500',
        fontFamily:
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji"',
        fontSize: '0.9rem',
        lineHeight: '1.25rem',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest!: FormGroup;

  constructor(
    private readonly stripeService: StripeService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly paymentApi: PaymentApi,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId') ?? '0';
  }

  async pay(): Promise<void> {
    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: {
          name: 'Test Name'
        }
      })
      .subscribe(async (result) => {
        if (result.error) {
          console.log(result.error.message);
        } else {
          // The payment has been processed!
          if (result.paymentMethod) {
            await this.postPayment(
              10,
              'usd',
              'Card',
              result.paymentMethod.id,
              'Test Name',
              result.paymentMethod.card!.exp_month,
              result.paymentMethod.card!.exp_year,
              result.paymentMethod.card!.last4
            );
          }
        }
      });
  }

  async postPayment(
    amount: number,
    currency: string,
    paymentMethod: string,
    paymentMethodId: string,
    cardName: string,
    expMonth: number,
    expYear: number,
    lastDigits: string
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
            cardName,
            expMonth.toString(),
            expYear.toString(),
            lastDigits
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      console.log(data);
      this.router.navigate(['/', 'order-confirmation', data.orderId]);
    } catch (error) {
      handleError(null, error);
    }
  }
}
