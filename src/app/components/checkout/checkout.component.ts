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

@Component({
  selector: 'app-checkout',
  imports: [
    NgFor,
    RouterLink,
    ReactiveFormsModule,
    IsInvalidPipe,
    NgIf,
    HasErrorPipe
  ],
  templateUrl: './checkout.component.html',
  styles: ``,
  providers: [OrderApi]
})
export class CheckoutComponent {
  checkoutForm: FormGroup = new FormGroup({
    deliveryMethod: new FormControl('standard', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('usa', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required])
  });

  reqInProgress = false;

  constructor(
    public readonly cartService: CartService,
    private readonly orderApi: OrderApi,
    private readonly router: Router
  ) {}

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

    let orderItems: { productId: string; quantity: number }[] = [];
    let shippingAddress: Address = {
      street: this.checkoutForm.value.street,
      city: this.checkoutForm.value.city,
      state: this.checkoutForm.value.state,
      country: this.checkoutForm.value.country,
      zipCode: this.checkoutForm.value.zipCode
    };

    let deliveryCharge: Price = {
      amount: 15,
      currency: 'usd'
    };

    this.cartService.cartItems.forEach((item) => {
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity
      });
    });

    try {
      const data = await firstValueFrom(
        this.orderApi
          .createOrder(orderItems, '', deliveryCharge, shippingAddress)
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.router.navigate(['/', 'payment', data.orderId]);
    } catch (error) {
      handleError(this.checkoutForm, error);
    }
  }
}
