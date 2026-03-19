import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { WishlistItem } from '../../interfaces/wishlist';
import { firstValueFrom, Observable } from 'rxjs';
import { ProductCardComponent } from '../product/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink, IconComponent],
  templateUrl: './wishlist.component.html',
  styles: ``
})
export class WishlistComponent implements OnInit {
  wishlist$!: Observable<WishlistItem[]>;

  constructor(private readonly wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlist$ = this.wishlistService.wishlist$;
  }

  async clearAll() {
    const items = await firstValueFrom(this.wishlist$);
    for (const item of items) {
      if (item.product) {
        await this.wishlistService.toggleWishlist(item.product);
      }
    }
  }
}
