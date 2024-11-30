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
  hideMobileFilters: boolean = true;
  hideSortingOptions: boolean = true;
  categoriesTree: CategoryTree[] = [];
  sortingOptions: string[] = [
    'Most Popular',
    'Best Rating',
    'newest',
    'Price: Low to High',
    'Price: High to Low'
  ];

  filterState: any = {
    selectedBrand: [],
    brandCollapsed: false,
    selectedCategory: [],
    categoryCollapsed: false,
    selectedColor: [],
    colorCollapsed: false,
    priceRange: '',
    sort: '',
    showAll: false
  };

  brands: string[] = [];
  colors: string[] = [];

  products: Product[] = [];

  constructor(
    private readonly productApi: ProductApi,
    private readonly categoryApi: CategoryApi
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.brands = ['Adidas', 'Hugo Boss', 'Zara', 'Gucci', 'H&M', 'Dior'];
    this.colors = ['White', 'Black', 'Blue', 'Green', 'Purple', 'Brown'];
    this.getCategoriesTree();
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
    const filters = new ProductQueryFilters();
    filters.pageSize = 12;
    this.productApi.getProducts(filters).subscribe((products) => {
      this.products = products;
    });
  }

  async getCategoriesTree() {
    try {
      this.categoriesTree = await firstValueFrom(
        this.categoryApi.getCategoriesTree()
      );
    } catch (error) {
      handleError(null, error);
    }
  }

  updateFilterState(filters: any) {
    this.filterState = { ...this.filterState, ...filters };
  }
}
