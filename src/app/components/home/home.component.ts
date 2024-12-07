import { Component, OnInit } from '@angular/core';
import { PromotionComponent } from './promotion/promotion.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { ShopFeaturesComponent } from './shop-features/shop-features.component';
import { BrandsComponent } from './brands/brands.component';
import { FeatureProductsComponent } from './feature-products/feature-products.component';
import { ProductApi } from '../../api/product.api';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../functions/error-handler';
import { ProductQueryFilters } from '../../models/ProductQueryFilters';
import {
  BlockProducts,
  ProductsBlockComponent
} from './products-block/products-block.component';

@Component({
  selector: 'app-home',
  imports: [
    PromotionComponent,
    ProductsBlockComponent,
    CallToActionComponent,
    ShopFeaturesComponent,
    BrandsComponent,
    FeatureProductsComponent,
    ProductsBlockComponent
  ],
  templateUrl: './home.component.html',
  styles: ``,
  providers: [ProductApi]
})
export class HomeComponent implements OnInit {
  topProducts: BlockProducts = {
    title: 'Our Top Products',
    products: []
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
  ngOnInit(): void {
    this.getTopCollection();
    this.getMenSection();
    this.getWomenSection();
  }

  async getMenSection() {
    try {
      const filters = new ProductQueryFilters();
      filters.categoryIds = [
        '106f4f94-5e70-4340-b23e-462af5fc7bfc',
        '124BCF8E-83FB-4B24-A8E1-405A8E45C091',
        '4A577A76-1884-4F6A-812F-CABDDC6A5A2A',
        '632DFDA9-CC2E-487B-8C88-608005F124E2'
      ];
      filters.pageNumber = 1;
      filters.pageSize = 5;

      const menCollection = await firstValueFrom(
        this.productApi.getProducts(filters)
      );
      this.menProducts.products = menCollection;
    } catch (error) {
      handleError(null, error);
    }
  }

  async getWomenSection() {
    try {
      const filters = new ProductQueryFilters();
      filters.categoryIds = [
        'BA5FE17F-8977-4034-BEC3-227AA99502CC',
        '35E6EF59-3419-4A43-9C23-3976722B06F9',
        'A805A418-2D53-4430-9968-D031C4F39FD4',
        '050132D0-956A-496F-B9BB-B674E8015A92'
      ];
      filters.pageNumber = 1;
      filters.pageSize = 5;

      const womenCollection = await firstValueFrom(
        this.productApi.getProducts(filters)
      );
      this.womenProducts.products = womenCollection;
    } catch (error) {
      handleError(null, error);
    }
  }

  async getTopCollection() {
    try {
      const filters = new ProductQueryFilters();
      filters.pageNumber = 1;
      filters.pageSize = 5;
      filters.averageRating = 4.6;

      const topCollection = await firstValueFrom(
        this.productApi.getProducts(filters)
      );
      this.topProducts.products = topCollection;
    } catch (error) {
      handleError(null, error);
    }
  }
}
