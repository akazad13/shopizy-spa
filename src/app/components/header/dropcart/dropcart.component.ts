import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartItem, CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dropcart',
  imports: [CommonModule, RouterLink, IconComponent, NgFor],
  templateUrl: './dropcart.component.html',
  styles: ``,
  providers: []
})
export class DropcartComponent implements OnInit {
  @Input() isDropCartOpened: boolean = false;
  cart$!: Observable<CartItem[]>;

  constructor(
    public readonly cartService: CartService,
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
  }

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }

  async removeProduct(cartItemId: string | null): Promise<void> {
    this.cartService.removeFromCart(cartItemId);
  }

  // async addProductSubscription(): Promise<void> {
  //   this.cartService.addProductSubjectData$.subscribe(
  //     async (cartItem: CartItem) => {
  //       let index = this.cartService.cartItems.findIndex(
  //         (item) =>
  //           item.productId === cartItem.productId &&
  //           item.color === cartItem.color &&
  //           item.size === cartItem.size
  //       );
  //       if (index != -1) {
  //         if (
  //           await this.updateProductQuantity(
  //             this.cartService.cartItems[index].productId,
  //             this.cartService.cartItems[index].cartItemId!,
  //             this.cartService.cartItems[index].quantity + 1
  //           )
  //         ) {
  //           this.cartService.cartItems[index].quantity++;
  //           this.cartService.calculateSubtotal();
  //         }
  //         return;
  //       }
  //       if (
  //         await this.addProduct(
  //           cartItem.productId,
  //           cartItem.color,
  //           cartItem.size
  //         )
  //       ) {
  //         // this.cartService.cartItems.push(cartItem);
  //         this.cartService.calculateSubtotal();
  //       }
  //     }
  //   );
  // }

  // async updateProductQuantity(
  //   productId: string,
  //   cartItemId: string,
  //   quantity: number
  // ): Promise<boolean> {
  //   try {
  //     const result = await firstValueFrom(
  //       this.cartApi.updateProductQuantityToCart(
  //         this.cart!.cartId,
  //         cartItemId,
  //         productId,
  //         quantity
  //       )
  //     );
  //     this.cart!.cartItems.find((cartItem) => cartItem.productId === productId)!
  //       .quantity++;
  //     return true;
  //   } catch (error) {
  //     handleError(null, error);
  //     return false;
  //   }
  // }
}
