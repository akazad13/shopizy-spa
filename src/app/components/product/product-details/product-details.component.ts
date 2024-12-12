import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { ActivatedRoute } from '@angular/router';
import { ProductDetail } from '../../../interfaces/product';
import { firstValueFrom } from 'rxjs';
import { ProductApi } from '../../../api/product.api';
import { handleError } from '../../../functions/error-handler';
import { CartItem, CartService } from '../../../services/cart.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [IconComponent, NgIf, NgFor],
  templateUrl: './product-details.component.html',
  styles: `
    .text-red-500 {
      text-color: red;
    }
  `,
  providers: [ProductApi],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetail | null = null;
  mainPhotoUrl: string | null = null;
  selectedTab: string = 'description';
  selectedColor: string = 'Black';
  availableSizes: string[] = [];
  availableColors: string[] = [];

  maxRating = 5.0;
  starsArray: string[] = [];
  starNumberArr: number[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productApi: ProductApi,
    private readonly cartService: CartService
  ) {}
  async ngOnInit(): Promise<void> {
    const productId =
      this.activatedRoute.snapshot.paramMap.get('productId') ?? '0';
    await this.getProduct(productId);
    if (this.product != null) {
      this.calculateStars();
      this.calculateStarNumberArray();
    }
  }

  addProductToCart() {
    this.cartService.addItem(
      new CartItem(
        this.product!.productId,
        this.product!.productImages?.[0].imageUrl,
        this.product!.name,
        this.product!.price,
        1,
        this.selectedColor
      )
    );
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

  private async getProduct(id: string): Promise<void> {
    try {
      this.product = await firstValueFrom(this.productApi.getProduct(id));
      this.mainPhotoUrl =
        this.product.productImages == null
          ? null
          : this.product.productImages[0].imageUrl;

      this.availableSizes = this.product.sizes.split(',');
      this.availableColors = this.product.colors.split(',');
    } catch (error) {
      handleError(null, error);
    }
  }

  calculateStars(): void {
    const fullStars = Math.floor(this.product!.averageRating.value); // Number of full stars
    const halfStar = this.product!.averageRating.value % 1 >= 0.5 ? 1 : 0; // Half star if fractional part >= 0.5
    const emptyStars = this.maxRating - fullStars - halfStar; // Remaining stars are empty

    // Fill the starsArray
    this.starsArray = [
      ...Array(fullStars).fill('full-star'),
      ...Array(halfStar).fill('half-star'),
      ...Array(emptyStars).fill('empty-star')
    ];
  }

  calculateStarNumberArray(): void {
    this.starNumberArr = Array(this.maxRating + 1).fill(0);
    for (let review of this.product!.productReviews) {
      this.starNumberArr[Math.floor(review.rating)]++;
    }
    this.starNumberArr = this.starNumberArr.slice(1, 6).reverse();
  }
}
