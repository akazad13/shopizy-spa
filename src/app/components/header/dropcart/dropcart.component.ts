import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartItem, CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product';
import { CartApi } from '../../../api/cart.api';
import { firstValueFrom } from 'rxjs';
import { Cart } from '../../../interfaces/cart';
import { handleError } from '../../../functions/error-handler';

@Component({
  selector: 'app-dropcart',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, NgFor],
  templateUrl: './dropcart.component.html',
  styles: ``,
  providers: [CartApi]
})
export class DropcartComponent implements OnInit {
  @Input() isDropCartOpened: boolean = false;

  cart: Cart | null = null;
  cartItems: CartItem[] = [];
  subtotal: number = 0;

  constructor(
    private readonly cartService: CartService,
    private readonly cartApi: CartApi
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.cart = await firstValueFrom(this.cartApi.getCart());
      this.cartItems = this.cart?.lineItems.map(
        (lineItem) =>
          new CartItem(
            lineItem.productId,
            lineItem.product.productImages[0],
            lineItem.product.name,
            +lineItem.product.price,
            lineItem.quantity,
            ''
          )
      );
    } catch (error) {
      handleError(null, error);
    }

    this.addProductSubscription();
  }

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }

  async removeProduct(productId: string): Promise<void> {
    const index = this.cartItems.findIndex(
      (item) => item.productId === productId
    );
    if (index != -1) {
      try {
        const result = await firstValueFrom(
          this.cartApi.removeProductFromCart(this.cart!.cartId, productId)
        );
        this.cartItems.splice(index, 1);
      } catch (error) {
        handleError(null, error);
      }
    }

    this.calculateSubtotal();
  }

  calculateSubtotal(): void {
    this.subtotal = 0;
    this.cartItems.forEach((item) => {
      this.subtotal += item.price * item.quantity;
    });
  }

  async addProductSubscription(): Promise<void> {
    this.cartService.addProductSubjectData$.subscribe(
      async (product: Product) => {
        let index = this.cartItems.findIndex(
          (item) => item.productId === product.productId
        );
        if (index != -1) {
          if (
            await this.updateProductQuantity(
              this.cartItems[index].productId,
              this.cartItems[index].quantity + 1
            )
          ) {
            this.cartItems[index].quantity++;
            this.calculateSubtotal();
          }
          return;
        }
        if (await this.addProduct(product.productId)) {
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
        }
      }
    );
  }

  async addProduct(productId: string): Promise<boolean> {
    try {
      if (this.cart == null) {
        this.cart = await firstValueFrom(
          this.cartApi.addCartWithFirstProduct(productId)
        );
        return true;
      } else {
        this.cart = await firstValueFrom(
          this.cartApi.addProductToCart(this.cart.cartId, productId)
        );
        return true;
      }
    } catch (error) {
      handleError(null, error);
      return false;
    }
  }

  async updateProductQuantity(
    productId: string,
    quantity: number
  ): Promise<boolean> {
    try {
      this.cart = await firstValueFrom(
        this.cartApi.updateProductQuantityToCart(
          this.cart!.cartId,
          productId,
          quantity
        )
      );
      return true;
    } catch (error) {
      handleError(null, error);
      return false;
    }
  }
}
