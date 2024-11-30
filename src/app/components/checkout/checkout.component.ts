import { NgFor } from '@angular/common';
import { CartItem, CartService } from './../../services/cart.service';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
    selector: 'app-checkout',
    imports: [NgFor, RouterLink, IconComponent],
    templateUrl: './checkout.component.html',
    styles: ``
})
export class CheckoutComponent {
  constructor(public readonly cartService: CartService) {}
  async ngOnInit(): Promise<void> {}

  updateProductQuantity(cartItem: CartItem) {
    this.cartService.addItem(cartItem);
  }

  async removeProduct(productId: string): Promise<void> {
    this.cartService.removeItem(productId);
  }
}
