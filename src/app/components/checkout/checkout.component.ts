import { NgFor } from '@angular/common';
import { CartItem, CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [NgFor, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styles: ``
})
export class CheckoutComponent implements OnInit {
  constructor(
    public readonly cartService: CartService,
    private fb: FormBuilder
  ) {}
  async ngOnInit(): Promise<void> {}

  updateProductQuantity(cartItem: CartItem) {
    this.cartService.addItem(cartItem);
  }

  async removeProduct(productId: string): Promise<void> {
    this.cartService.removeItem(productId);
  }
}
