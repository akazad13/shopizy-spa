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

  get productId(): string {
    return (this.product as any).id || (this.product as any).productId;
  }

  get imageUrl(): string | undefined {
    if (this.product.productImages && this.product.productImages.length > 0) {
      return (this.product.productImages[0] as any).imageUrl || (this.product.productImages[0] as any);
    }
    if ((this.product as any).imageUrls && (this.product as any).imageUrls.length > 0) {
      return (this.product as any).imageUrls[0];
    }
    return undefined;
  }

  get rating(): number {
    if (typeof this.product.averageRating === 'number') {
      return this.product.averageRating;
    }
    return (this.product.averageRating as any)?.value ?? 0;
  }

  get isBogo(): boolean {
    return !!(this.product as any).isBogo || ((this.product as any).tags && (this.product as any).tags.includes('bogo'));
  }

  get isFreeShipping(): boolean {
    return !!(this.product as any).isFreeShippingQualified || this.product.price >= 75 || ((this.product as any).tags && (this.product as any).tags.includes('free-shipping'));
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.productId);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    const color = (this.product.colors && this.product.colors.length > 0) ? this.product.colors[0] : 'Standard';
    const size = (this.product.sizes && this.product.sizes.length > 0) ? this.product.sizes[0] : 'Standard';
    
    this.cartService.addToCart({
      cartItemId: null,
      productId: this.productId,
      image: this.imageUrl,
      name: this.product.name,
      price: this.product.price,
      discount: this.product.discount || 0,
      quantity: 1,
      color: color,
      size: size
    });
    this.toast.success(`Added ${this.product.name} to cart`);
  }
}

