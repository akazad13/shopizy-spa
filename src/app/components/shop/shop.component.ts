import { Color, ShopFilterState } from './../../interfaces/shop';
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
import { Brand } from '../../interfaces/brand';

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
  brands: Brand[] = [];
  colors: Color[] = [];
  products: Product[] = [];
  filters = new ProductQueryFilters();

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
    this.brands = [
      {
        id: 'brand1',
        name: 'Adidas',
        image: 'adidas.png',
        country: 'Germany'
      },
      {
        id: 'brand2',
        name: 'Hugo Boss',
        image: 'hugo-boss.png',
        country: 'France'
      },
      {
        id: 'brand3',
        name: 'Zara',
        image: 'zara.png',
        country: 'France'
      },
      {
        id: 'brand4',
        name: 'Gucci',
        image: 'gucci.png',
        country: 'Italy'
      },
      {
        id: 'brand5',
        name: 'H&M',
        image: 'hm.png',
        country: 'France'
      },
      {
        id: 'brand6',
        name: 'Dior',
        image: 'dior.png',
        country: 'France'
      }
    ];
    this.colors = [
      {
        name: 'White',
        checked: false
      },
      {
        name: 'Black',
        checked: false
      },
      {
        name: 'Blue',
        checked: false
      },
      {
        name: 'Green',
        checked: false
      },
      {
        name: 'Purple',
        checked: false
      },
      {
        name: 'Brown',
        checked: false
      }
    ];
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
    this.filters.pageSize = 8;
    this.filters.categoryIds = this.shopFilterState.selectedCategory;

    try {
      this.products = await firstValueFrom(
        this.productApi.getProducts(this.filters)
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

  async previous(): Promise<void> {
    if (this.filters.pageNumber === 0) {
      return;
    }
    this.filters.pageNumber--;
    await this.getProducts();
  }

  async next(): Promise<void> {
    this.filters.pageNumber++;
    await this.getProducts();
  }
}
