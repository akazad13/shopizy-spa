import { Component, OnInit } from '@angular/core';
import { PromotionComponent } from './promotion/promotion.component';
import {
  BlockProductsComponent,
  BlockProducts
} from '../blocks/block-products/block-products.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { ShopFeaturesComponent } from './shop-features/shop-features.component';
import { ShortStoryComponent } from './short-story/short-story.component';
import { BrandsComponent } from './brands/brands.component';
import { FeatureProductsComponent } from './feature-products/feature-products.component';
import { ProductApi } from '../../api/product.api';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../functions/error-handler';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PromotionComponent,
    BlockProductsComponent,
    CallToActionComponent,
    ShopFeaturesComponent,
    ShortStoryComponent,
    BrandsComponent,
    FeatureProductsComponent
  ],
  templateUrl: './home.component.html',
  styles: ``,
  providers: [ProductApi]
})
export class HomeComponent implements OnInit {
  topProducts: BlockProducts = {
    title: 'Our Top Products',
    products: [
      {
        productId: '1',
        name: 'Product 1',
        price: 100,
        productImages: [
          {
            productImageId: 'dfdsfdsdsfdsfdsfdsfds',
            imageUrl:
              'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg'
          }
        ],
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        specifications: [
          {
            name: 'Color',
            value: 'Black'
          }
        ]
      },
      {
        productId: '2',
        name: 'Product 2',
        price: 200,
        productImages: [
          {
            productImageId: 'dfdsfdsdsfdsfdsfdsfds',
            imageUrl:
              'https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-06.jpg'
          }
        ],
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        specifications: [
          {
            name: 'Color',
            value: 'Black'
          }
        ]
      },
      {
        productId: '3',
        name: 'Product 3',
        price: 50,
        productImages: [
          {
            productImageId: 'dfdsfdsdsfdsfdsfdsfds',
            imageUrl:
              'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-04.jpg'
          }
        ],
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        specifications: [
          {
            name: 'Color',
            value: 'Black'
          }
        ]
      },
      {
        productId: '4',
        name: 'Product 4',
        price: 80,
        productImages: [
          {
            productImageId: 'dfdsfdsdsfdsfdsfdsfds',
            imageUrl:
              'https://tailwindui.com/plus/img/ecommerce-images/home-page-03-favorite-03.jpg'
          }
        ],
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        specifications: [
          {
            name: 'Color',
            value: 'Black'
          }
        ]
      }
    ]
  };

  womenProducts: BlockProducts = {
    title: 'Women Collections',
    products: []
  };

  menProducts: BlockProducts = {
    title: 'Men Collections',
    products: []
  };

  constructor(private readonly productApi: ProductApi) {}
  async ngOnInit(): Promise<void> {
    await this.getMenSection();
    await this.getWomenSection();
  }

  async getMenSection() {
    try {
      const menCollection = await firstValueFrom(
        this.productApi.getProducts('men')
      );
      this.menProducts.products = menCollection;
    } catch (error) {
      handleError(null, error);
    }
  }
  async getWomenSection() {
    try {
      const womenCollection = await firstValueFrom(
        this.productApi.getProducts('women')
      );
      this.womenProducts.products = womenCollection;
    } catch (error) {
      handleError(null, error);
    }
  }
}
