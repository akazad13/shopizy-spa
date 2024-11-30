import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartItem, CartService } from '../../../services/cart.service';
import { CartApi } from '../../../api/cart.api';
import { firstValueFrom } from 'rxjs';
import { Cart } from '../../../interfaces/cart';
import { handleError } from '../../../functions/error-handler';

@Component({
    selector: 'app-dropcart',
    imports: [CommonModule, RouterLink, IconComponent, NgFor],
    templateUrl: './dropcart.component.html',
    styles: ``,
    providers: [CartApi]
})
export class DropcartComponent implements OnInit {
  @Input() isDropCartOpened: boolean = false;
  cart: Cart | null = null;

  constructor(
    public readonly cartService: CartService,
    private readonly cartApi: CartApi
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.cart = await firstValueFrom(this.cartApi.getCart());
      this.cartService.cartItems = this.cart?.lineItems.map(
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
      this.cartService.calculateSubtotal();
    } catch (error) {
      handleError(null, error);
    }

    this.addProductSubscription();
  }

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }

  async removeProduct(productId: string): Promise<void> {
    const index = this.cartService.cartItems.findIndex(
      (item) => item.productId === productId
    );
    if (index != -1) {
      try {
        const result = await firstValueFrom(
          this.cartApi.removeProductFromCart(this.cart!.cartId, productId)
        );
        this.cartService.cartItems.splice(index, 1);
      } catch (error) {
        handleError(null, error);
      }
    }

    this.cartService.calculateSubtotal();
  }

  async addProductSubscription(): Promise<void> {
    this.cartService.addProductSubjectData$.subscribe(
      async (cartItem: CartItem) => {
        let index = this.cartService.cartItems.findIndex(
          (item) => item.productId === cartItem.productId
        );
        if (index != -1) {
          if (
            await this.updateProductQuantity(
              this.cartService.cartItems[index].productId,
              this.cartService.cartItems[index].quantity + 1
            )
          ) {
            this.cartService.cartItems[index].quantity++;
            this.cartService.calculateSubtotal();
          }
          return;
        }
        if (await this.addProduct(cartItem.productId)) {
          this.cartService.cartItems.push(cartItem);
          this.cartService.calculateSubtotal();
        }
      }
    );
  }

  async removeProductSubscription(): Promise<void> {
    this.cartService.removeProductSubjectData$.subscribe(
      async (productId: string) => {
        await this.removeProduct(productId);
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
      const result = await firstValueFrom(
        this.cartApi.updateProductQuantityToCart(
          this.cart!.cartId,
          productId,
          quantity
        )
      );
      this.cart!.lineItems.find((lineItem) => lineItem.productId === productId)!
        .quantity++;
      return true;
    } catch (error) {
      handleError(null, error);
      return false;
    }
  }
}
