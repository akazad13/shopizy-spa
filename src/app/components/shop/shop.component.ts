import { Color, ShopFilterState } from './../../interfaces/shop';
import { Product } from '../../interfaces/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductsGridComponent } from '../product/products-grid/products-grid.component';
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MobileFiltersComponent } from './mobile-filters/mobile-filters.component';
import { CommonModule } from '@angular/common';
import { ProductApi } from '../../api/product.api';
import { ProductQueryFilters } from '../../models/QueryFilters';
import { CategoryTree } from '../../interfaces/category';
import { firstValueFrom } from 'rxjs';
import { CategoryApi } from '../../api/category.api';
import { handleError } from '../../functions/error-handler';
import { Brand } from '../../interfaces/brand';
import { IconComponent } from '../shared/icon/icon.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductsGridComponent,
    MobileFiltersComponent,
    ShopFiltersComponent,
    CommonModule,
    IconComponent,
    PaginationComponent
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
  totalPages = 5; // Placeholder since API doesn't return count

  shopFilterState: ShopFilterState = {
    hideMobileFilters: true,
    selectedBrand: [],
    brandCollapsed: false,
    selectedCategory: [],
    categoryCollapsed: false,
    selectedColor: [],
    colorCollapsed: false,
    priceRange: 500,
    sort: '',
    showAll: false,
    hideSortingOptions: true,
    sortingOptions: [
      'Newest Arrivals',
      'Price: Low to High',
      'Price: High to Low',
      'Most Popular',
      'Rating: High to Low'
    ]
  };

  constructor(
    private readonly productApi: ProductApi,
    private readonly categoryApi: CategoryApi,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['search']) {
        this.filters.name = params['search'];
      } else {
        this.filters.name = null;
      }
      this.getProducts();
    });

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
    this.filters.brandIds = this.shopFilterState.selectedBrand;
    this.filters.colors = this.shopFilterState.selectedColor;
    this.filters.maxPrice = this.shopFilterState.priceRange;
    this.filters.sortBy = this.shopFilterState.sort;

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

  async onPageChange(page: number): Promise<void> {
    this.filters.pageNumber = page;
    await this.getProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async previous(): Promise<void> {
    if (this.filters.pageNumber > 1) {
      await this.onPageChange(this.filters.pageNumber - 1);
    }
  }

  async next(): Promise<void> {
    if (this.products.length >= this.filters.pageSize) {
      await this.onPageChange(this.filters.pageNumber + 1);
    }
  }

  onSort(sortingOption: string): void {
    let sortValue = '';
    switch (sortingOption) {
      case 'Newest Arrivals': sortValue = 'newest'; break;
      case 'Price: Low to High': sortValue = 'price-asc'; break;
      case 'Price: High to Low': sortValue = 'price-desc'; break;
      case 'Most Popular': sortValue = 'popular'; break;
      case 'Rating: High to Low': sortValue = 'rating-desc'; break;
      default: sortValue = '';
    }
    
    this.shopFilterState.sort = sortValue;
    this.shopFilterState.hideSortingOptions = true;
    this.getProducts();
  }
}
