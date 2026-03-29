import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';
import { WishlistService } from '../../../services/wishlist.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartService } from '../../../services/cart.service';

import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink, RatingComponent, IconComponent],
  providers: [],
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent {
  @Input() product!: Product;
  maxRating = 5.0;

  constructor(
    private readonly wishlistService: WishlistService,
    private readonly cartService: CartService,
    private readonly toast: ToastService
  ) {}

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.productId);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    const color = (this.product.colors && this.product.colors.length > 0) ? this.product.colors[0] : 'Standard';
    const size = (this.product.sizes && this.product.sizes.length > 0) ? this.product.sizes[0] : 'Standard';
    
    this.cartService.addToCart({
      cartItemId: null,
      productId: this.product.productId,
      image: this.product.productImages?.[0]?.imageUrl,
      name: this.product.name,
      price: this.product.price,
      discount: this.product.discount,
      quantity: 1,
      color: color,
      size: size
    });
    this.toast.success(`Added ${this.product.name} to cart`);
  }
}

