import { CommonModule, NgFor } from '@angular/common';
import { CartItem, CartService } from './../../services/cart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon.component';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardGroupDirective,
  StripeCardNumberComponent,
  StripeService
} from 'ngx-stripe';

@Component({
  selector: 'app-checkout',
  imports: [
    NgFor,
    RouterLink,
    StripeCardNumberComponent,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardGroupDirective,
    CommonModule,
    ReactiveFormsModule,
    IconComponent
  ],
  templateUrl: './checkout.component.html',
  styles: ``
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '500',
        fontFamily:
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji"',
        fontSize: '0.875rem',
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
    public readonly cartService: CartService,
    private fb: FormBuilder,
    private stripeService: StripeService
  ) {}
  async ngOnInit(): Promise<void> {}

  updateProductQuantity(cartItem: CartItem) {
    this.cartService.addItem(cartItem);
  }

  async removeProduct(productId: string): Promise<void> {
    this.cartService.removeItem(productId);
  }
}
