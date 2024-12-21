import { NgFor, NgIf } from '@angular/common';
import { CartItem, CartService } from './../../services/cart.service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { IsInvalidPipe } from '../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../pipes/has-error.pipe';
import { finalize, firstValueFrom } from 'rxjs';
import { OrderApi } from '../../api/order.api';
import { Address } from '../../interfaces/Address';
import { Price } from '../../interfaces/Price';
import { handleError } from '../../functions/error-handler';
import { IconComponent } from '../shared/icon/icon.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  imports: [
    NgFor,
    RouterLink,
    ReactiveFormsModule,
    IsInvalidPipe,
    NgIf,
    HasErrorPipe,
    IconComponent
  ],
  templateUrl: './checkout.component.html',
  styles: ``,
  providers: []
})
export class CheckoutComponent {
  isLoggedIn: boolean = false;

  checkoutForm: FormGroup = new FormGroup({
    deliveryMethod: new FormControl('1', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('US', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('')
  });

  deliveryMethods = [
    {
      deliveryMethod: 1,
      label: 'Standard',
      timeline: 'Get it by 3-5 business days',
      price: { amount: 9.99, currency: 'usd' }
    },
    {
      deliveryMethod: 2,
      label: 'Express',
      timeline: 'Get it by tomorrow',
      price: { amount: 14.99, currency: 'usd' }
    },
    {
      deliveryMethod: 3,
      label: 'Premium',
      timeline: 'Get it by today',
      price: { amount: 19.99, currency: 'usd' }
    }
  ];

  reqInProgress = false;

  constructor(
    public readonly cartService: CartService,
    private readonly orderApi: OrderApi,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.isLoggedIn = this.authService.loggedIn();

    if (!this.isLoggedIn) {
      this.checkoutForm
        .get('phoneNumber')
        ?.setValidators([Validators.required]);
      this.checkoutForm.get('phoneNumber')?.updateValueAndValidity();
    }
  }

  updateProductQuantity(cartItem: CartItem) {
    this.cartService.addItem(cartItem);
  }

  async removeProduct(productId: string): Promise<void> {
    this.cartService.removeItem(productId);
  }

  get formData() {
    return this.checkoutForm.controls;
  }

  async submitOrder(): Promise<void> {
    this.checkoutForm.markAllAsTouched();

    if (this.reqInProgress || this.checkoutForm.invalid) {
      return;
    }

    this.reqInProgress = true;

    const orderItems: {
      productId: string;
      quantity: number;
      color: string;
      size: string;
    }[] = [];
    const shippingAddress: Address = {
      street: this.checkoutForm.value.street,
      city: this.checkoutForm.value.city,
      state: this.checkoutForm.value.state,
      country: this.checkoutForm.value.country,
      zipCode: this.checkoutForm.value.zipCode
    };

    const seletedDeliveryMethod = this.deliveryMethods.find(
      (dm) => dm.deliveryMethod == this.checkoutForm.value.deliveryMethod
    );

    const deliveryCharge: Price = {
      amount: seletedDeliveryMethod!.price.amount,
      currency: seletedDeliveryMethod!.price.currency
    };

    this.cartService.cartItems.forEach((item) => {
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      });
    });

    try {
      const data = await firstValueFrom(
        this.orderApi
          .createOrder(
            orderItems,
            '',
            seletedDeliveryMethod!.deliveryMethod,
            deliveryCharge,
            shippingAddress
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.router.navigate(['/', 'payment', data.orderId]);
    } catch (error) {
      handleError(this.checkoutForm, error);
    }
  }
}
