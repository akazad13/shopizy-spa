import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartItem, CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dropcart',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dropcart.component.html',
  styles: ``,
  providers: []
})
export class DropcartComponent implements OnInit {
  @Input() isDropCartOpened: boolean = false;
  cart$!: Observable<CartItem[]>;

  constructor(
    public readonly cartService: CartService,
    public readonly authService: AuthService,
    public readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.cart$ = this.cartService.getCart();
  }

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }

  async removeProduct(cartItemId: string | null): Promise<void> {
    this.cartService.removeFromCart(cartItemId);
  }

  checkout(): void {
    this.isDropCartOpened = false;
    if (this.authService.loggedIn()) {
      this.router.navigate(['/', 'checkout']);
    } else {
      this.router.navigate(['auth', 'signin']);
    }
  }
}
