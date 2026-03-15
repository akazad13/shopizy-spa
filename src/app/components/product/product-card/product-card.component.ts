import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';
import { WishlistService } from '../../../services/wishlist.service';
import { IconComponent } from '../../shared/icon/icon.component';

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

  constructor(private readonly wishlistService: WishlistService) {}

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.productId);
  }
}
