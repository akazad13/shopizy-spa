import { ShopFilterState } from './../../interfaces/shop';
import { Product } from '../../interfaces/product';
import { Component, OnInit } from '@angular/core';
import { ProductsGridComponent } from '../product/products-grid/products-grid.component';
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MobileFiltersComponent } from './mobile-filters/mobile-filters.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../shared/icon/icon.component';
import { ProductApi } from '../../api/product.api';
import { ProductQueryFilters } from '../../models/ProductQueryFilters';
import { CategoryTree } from '../../interfaces/category';
import { firstValueFrom } from 'rxjs';
import { CategoryApi } from '../../api/category.api';
import { handleError } from '../../functions/error-handler';

@Component({
  selector: 'app-shop',
  imports: [
    ProductsGridComponent,
    MobileFiltersComponent,
    ShopFiltersComponent,
    CommonModule,
    IconComponent
  ],
  templateUrl: './shop.component.html',
  styles: ``,
  providers: [ProductApi, CategoryApi]
})
export class ShopComponent implements OnInit {
  categoryTree: CategoryTree[] = [];
  brands: string[] = [];
  colors: string[] = [];
  products: Product[] = [];

  shopFilterState: ShopFilterState = {
    hideMobileFilters: true,
    selectedBrand: [],
    brandCollapsed: false,
    selectedCategory: [],
    categoryCollapsed: false,
    selectedColor: [],
    colorCollapsed: false,
    priceRange: 100,
    sort: '',
    showAll: false,
    hideSortingOptions: true,
    sortingOptions: [
      'Most Popular',
      'Best Rating',
      'newest',
      'Price: Low to High',
      'Price: High to Low'
    ]
  };

  constructor(
    private readonly productApi: ProductApi,
    private readonly categoryApi: CategoryApi
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.brands = ['Adidas', 'Hugo Boss', 'Zara', 'Gucci', 'H&M', 'Dior'];
    this.colors = ['White', 'Black', 'Blue', 'Green', 'Purple', 'Brown'];
    this.getcategoryTree();
  }

  showHideMobileFiltersDrawer(val: string): void {
    if (val == 'show') {
      this.shopFilterState.hideMobileFilters = false;
    } else {
      this.shopFilterState.hideMobileFilters = true;
    }
  }

  showHideSortingOptions(): void {
    this.shopFilterState.hideSortingOptions =
      !this.shopFilterState.hideSortingOptions;
  }

  async getProducts(): Promise<void> {
    const filters = new ProductQueryFilters();
    filters.pageSize = 8;
    filters.categoryIds = this.shopFilterState.selectedCategory;

    try {
      this.products = await firstValueFrom(
        this.productApi.getProducts(filters)
      );
    } catch (error) {
      handleError(null, error);
    }
  }

  async getcategoryTree() {
    try {
      this.categoryTree = await firstValueFrom(
        this.categoryApi.getcategoryTree()
      );
    } catch (error) {
      handleError(null, error);
    }
  }

  updateFilterState(filters: any) {
    this.shopFilterState = { ...this.shopFilterState, ...filters };
  }

  async updateProductGrid(filters: any): Promise<void> {
    this.shopFilterState = { ...this.shopFilterState, ...filters };
    await this.getProducts();
  }
}
