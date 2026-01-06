import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductDetail } from '../../../interfaces/product';
import { CartItem, CartService } from '../../../services/cart.service';

import { RatingComponent } from '../rating/rating.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, IconComponent, RatingComponent],
  templateUrl: './product-details.component.html',
  styles: `
    .text-red-500 {
      text-color: red;
    }
  `,
  providers: []
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: ProductDetail;
  mainPhotoUrl: string | null = null;
  selectedTab = 'description';
  selectedColor = '';
  selectedSize = '';
  availableSizes: string[] = [];
  availableColors: string[] = [];
  colorMap: Map<string, string> = new Map<string, string>();

  maxRating = 5.0;
  starsArray: string[] = [];
  starNumberArr: { num: number; pct: number }[] = [];

  routeSubscription!: Subscription;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly cartService: CartService
  ) {
    this.mapColors();
  }
  async ngOnInit(): Promise<void> {
    this.routeSubscription = this.activatedRoute.data.subscribe((data) => {
      this.product = data['product'];
      if (this.product != null) {
        this.mainPhotoUrl =
          this.product.productImages == null
            ? null
            : this.product.productImages[0].imageUrl;

        this.availableSizes = this.product.sizes.split(',');
        this.availableColors = this.product.colors.split(',');

        this.selectedColor = this.availableColors[0];
        this.selectedSize = this.availableSizes[0];

        this.calculateStarNumberArray();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  addProductToCart() {
    const cartItem: CartItem = {
      cartItemId: null,
      productId: this.product.productId,
      image: this.product.productImages?.[0].imageUrl,
      name: this.product.name,
      price: this.product.price,
      discount: this.product.discount,
      quantity: 1,
      color: this.selectedColor,
      size: this.selectedSize
    };
    this.cartService.addToCart(cartItem);
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  changeProductImage(productImageUrl: string | undefined) {
    if (productImageUrl == null) {
      return;
    }
    this.mainPhotoUrl = productImageUrl;
  }

  updateTabSelection(selectedTab: string) {
    this.selectedTab = selectedTab;
  }

  calculateStarNumberArray(): void {
    this.starNumberArr = Array.from({ length: 6 }, () => ({
      ...{ num: 0, pct: 0 }
    }));
    for (const review of this.product.productReviews) {
      this.starNumberArr[Math.floor(review.rating)].num++;
    }
    this.starNumberArr = this.starNumberArr.slice(1, 6).reverse();

    for (const element of this.starNumberArr) {
      element.pct = (element.num * 100) / this.product.averageRating.numRatings;
    }
  }

  mapColors(): void {
    this.colorMap.set('Black', 'bg-black');
    this.colorMap.set('White', 'bg-white');
    this.colorMap.set('Red', 'bg-red-500');
    this.colorMap.set('Blue', 'bg-blue-500');
    this.colorMap.set('Green', 'bg-green-600');
    this.colorMap.set('Purple', 'bg-purple-500');
    this.colorMap.set('Orange', 'bg-orange-400');
    this.colorMap.set('Gray', 'bg-gray-500');
    this.colorMap.set('Pink', 'bg-pink-400');
    this.colorMap.set('Yellow', 'bg-yellow-400');
    this.colorMap.set('Brown', 'bg-brown-600');
    this.colorMap.set('Cyan', 'bg-cyan-500');
    this.colorMap.set('Magenta', 'bg-magenta-500');
  }
}
