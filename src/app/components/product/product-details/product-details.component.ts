import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/product';
import { firstValueFrom } from 'rxjs';
import { ProductApi } from '../../../api/product.api';
import { handleError } from '../../../functions/error-handler';
import { CartItem, CartService } from '../../../services/cart.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [IconComponent, NgIf, NgFor],
  templateUrl: './product-details.component.html',
  styles: ``,
  providers: [ProductApi],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  mainPhotoUrl: string | null = null;
  selectedTab: string = 'description';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productApi: ProductApi,
    private readonly cartService: CartService
  ) {}
  async ngOnInit(): Promise<void> {
    const productId =
      this.activatedRoute.snapshot.paramMap.get('productId') ?? '0';
    await this.getPost(productId);
  }

  addProductToCart() {
    this.cartService.addItem(
      new CartItem(
        this.product!.productId,
        this.product!.productImages?.[0].imageUrl,
        this.product!.name,
        this.product!.price,
        1,
        this.product!.specifications?.[0]?.value
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

  private async getPost(id: string): Promise<void> {
    try {
      this.product = await firstValueFrom(this.productApi.getProduct(id));
      this.mainPhotoUrl =
        this.product.productImages == null
          ? null
          : this.product.productImages[0].imageUrl;
    } catch (error) {
      handleError(null, error);
    }
  }
}
