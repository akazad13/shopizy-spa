import { BlockProductsComponent } from '../blocks/block-products/block-products.component';
import { Product } from '../../interfaces/product';
import { Component, OnInit } from '@angular/core';
import { ProductsGridComponent } from '../product/products-grid/products-grid.component';
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MobileFiltersComponent } from './mobile-filters/mobile-filters.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../shared/icon/icon.component';
import { ProductApi } from '../../api/product.api';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    BlockProductsComponent,
    ProductsGridComponent,
    MobileFiltersComponent,
    ShopFiltersComponent,
    CommonModule,
    IconComponent
  ],
  templateUrl: './shop.component.html',
  styles: ``,
  providers: [ProductApi]
})
export class ShopComponent implements OnInit {
  hideMobileFilters: boolean = true;
  hideSortingOptions: boolean = true;

  products: Product[] = [];

  constructor(private readonly productApi: ProductApi) {}

  ngOnInit(): void {
    this.getProducts();
  }

  showHideMobileFiltersDrawer(val: string): void {
    if (val == 'show') {
      this.hideMobileFilters = false;
    } else {
      this.hideMobileFilters = true;
    }
  }

  showHideSortingOptions(): void {
    this.hideSortingOptions = !this.hideSortingOptions;
  }

  getProducts() {
    this.productApi.getProducts('all').subscribe((products) => {
      this.products = products;
    });
  }
}
