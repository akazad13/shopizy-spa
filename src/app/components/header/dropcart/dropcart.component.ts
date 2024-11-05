import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartItem, CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product';

@Component({
  selector: 'app-dropcart',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, NgFor],
  templateUrl: './dropcart.component.html',
  styles: ``
})
export class DropcartComponent implements OnInit {
  @Input() isDropCartOpened: boolean = false;

  cartItems: CartItem[] = [];
  subtotal: number = 0;

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.addProductSubjectData$.subscribe((product: Product) => {
      let index = this.cartItems.findIndex(
        (item) => item.productId === product.productId
      );
      if (index != -1) {
        this.cartItems[index].quantity++;
        this.calculateSubtotal();
        return;
      }
      this.cartItems.push(
        new CartItem(
          product.productId,
          product.productImages?.[0].imageUrl,
          product.name,
          product.price,
          1,
          product?.specifications?.[0]?.value
        )
      );
      this.calculateSubtotal();
    });
  }

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }

  removeProduct(productId: string): void {
    const index = this.cartItems.findIndex(
      (item) => item.productId === productId
    );
    if (index != -1) {
      this.cartItems.splice(index, 1);
    }

    this.calculateSubtotal();
  }

  calculateSubtotal(): void {
    this.subtotal = 0;
    this.cartItems.forEach((item) => {
      this.subtotal += item.price * item.quantity;
    });
  }
}
