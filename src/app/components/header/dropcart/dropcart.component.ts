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
  providers: []
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
      this.syncCartItems();
      this.cartService.calculateSubtotal();
    } catch (error) {
      handleError(null, error);
    }

    this.addProductSubscription();
  }

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }

  async removeProduct(cartItemId: string | null): Promise<void> {
    if (cartItemId != null) {
      try {
        const result = await firstValueFrom(
          this.cartApi.removeProductFromCart(this.cart!.cartId, cartItemId)
        );

        const index = this.cartService.cartItems.findIndex(
          (item) => item.cartItemId === cartItemId
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
          (item) =>
            item.productId === cartItem.productId &&
            item.color === cartItem.color &&
            item.size === cartItem.size
        );
        if (index != -1) {
          if (
            await this.updateProductQuantity(
              this.cartService.cartItems[index].productId,
              this.cartService.cartItems[index].cartItemId!,
              this.cartService.cartItems[index].quantity + 1
            )
          ) {
            this.cartService.cartItems[index].quantity++;
            this.cartService.calculateSubtotal();
          }
          return;
        }
        if (
          await this.addProduct(
            cartItem.productId,
            cartItem.color,
            cartItem.size
          )
        ) {
          // this.cartService.cartItems.push(cartItem);
          this.syncCartItems();
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

  async addProduct(
    productId: string,
    color: string,
    size: string
  ): Promise<boolean> {
    try {
      if (this.cart == null) {
        this.cart = await firstValueFrom(
          this.cartApi.addCartWithFirstProduct(productId, color, size)
        );
        return true;
      } else {
        this.cart = await firstValueFrom(
          this.cartApi.addProductToCart(
            this.cart.cartId,
            productId,
            color,
            size
          )
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
    cartItemId: string,
    quantity: number
  ): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.cartApi.updateProductQuantityToCart(
          this.cart!.cartId,
          cartItemId,
          productId,
          quantity
        )
      );
      this.cart!.cartItems.find((cartItem) => cartItem.productId === productId)!
        .quantity++;
      return true;
    } catch (error) {
      handleError(null, error);
      return false;
    }
  }

  syncCartItems(): void {
    this.cartService.cartItems = this.cart!.cartItems.map(
      (cartItem) =>
        new CartItem(
          cartItem.cartItemId,
          cartItem.productId,
          cartItem.product.productImages[0],
          cartItem.product.name,
          +cartItem.product.price,
          cartItem.quantity,
          cartItem.color,
          cartItem.size
        )
    );
  }
}
