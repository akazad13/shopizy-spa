import { Color, ShopFilterState } from './../../interfaces/shop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductsGridComponent } from '../product/products-grid/products-grid.component';
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MobileFiltersComponent } from './mobile-filters/mobile-filters.component';
import { CommonModule } from '@angular/common';
import { ProductApi } from '../../api/product.api';
import { CategoryTree } from '../../interfaces/category';
import { firstValueFrom } from 'rxjs';
import { CategoryApi } from '../../api/category.api';
import { handleError } from '../../functions/error-handler';
import { Brand } from '../../interfaces/brand';
import { IconComponent } from '../shared/icon/icon.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { BrandApi } from '../../api/brand.api';
import { FormsModule } from '@angular/forms';
import { SearchFacet, FacetedSearchRequest } from '../../types/api';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductsGridComponent,
    MobileFiltersComponent,
    ShopFiltersComponent,
    CommonModule,
    FormsModule,
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
  products: any[] = [];
  loadingProducts = true;
  totalPages = 1;
  totalCount = 0;
  pageNumber = 1;
  pageSize = 12;

  searchTerm = '';
  suggestedKeywords: string[] = [];
  facets: SearchFacet[] = [];
  inStockOnly = false;
  minRating = 0;

  shopFilterState: ShopFilterState = {
    hideMobileFilters: true,
    selectedBrand: [],
    brandCollapsed: false,
    selectedCategory: [],
    categoryCollapsed: false,
    selectedColor: [],
    priceRange: 500,
    sort: 'newest',
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
    private readonly brandApi: BrandApi,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.searchTerm = params['search'] || params['q'] || '';
      if (params['category']) {
        this.shopFilterState.selectedCategory = [params['category']];
      }
      this.getProducts();
    });

    this.getBrands();
    this.getCategoryTree();
  }

  showHideMobileFiltersDrawer(val: string): void {
    this.shopFilterState.hideMobileFilters = val !== 'show';
  }

  showHideSortingOptions(): void {
    this.shopFilterState.hideSortingOptions =
      !this.shopFilterState.hideSortingOptions;
  }

  async getProducts(): Promise<void> {
    this.loadingProducts = true;
    const request: FacetedSearchRequest = {
      searchTerm: this.searchTerm ? this.searchTerm.trim() : undefined,
      categoryIds:
        this.shopFilterState.selectedCategory.length > 0
          ? this.shopFilterState.selectedCategory
          : undefined,
      brandIds:
        this.shopFilterState.selectedBrand.length > 0
          ? this.shopFilterState.selectedBrand
          : undefined,
      maxPrice:
        this.shopFilterState.priceRange > 0
          ? this.shopFilterState.priceRange
          : undefined,
      inStockOnly: this.inStockOnly ? true : undefined,
      minRating: this.minRating > 0 ? this.minRating : undefined,
      sortBy: this.shopFilterState.sort || 'newest',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    try {
      const res = await firstValueFrom(this.productApi.facetedSearch(request));
      this.products = res.items || [];
      this.totalCount = res.totalCount || this.products.length;
      this.totalPages = res.totalPages || Math.ceil(this.totalCount / this.pageSize) || 1;
      this.facets = res.facets || [];
      this.suggestedKeywords = res.suggestedKeywords || [];
    } catch {
      // Fallback to basic getProducts if faceted search fails
      try {
        const fallbackRes = await firstValueFrom(
          this.productApi.getProducts({
            name: this.searchTerm || null,
            categoryIds: this.shopFilterState.selectedCategory,
            brandIds: this.shopFilterState.selectedBrand,
            maxPrice: this.shopFilterState.priceRange,
            sortBy: this.shopFilterState.sort,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
          } as any)
        );
        this.products = fallbackRes.items || [];
        this.totalCount = fallbackRes.totalCount || this.products.length;
        this.totalPages = fallbackRes.totalPages || 1;
      } catch (fallbackErr) {
        handleError(null, fallbackErr);
      }
    } finally {
      this.loadingProducts = false;
    }
  }

  onSearchSubmit(): void {
    this.pageNumber = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchTerm || null },
      queryParamsHandling: 'merge'
    });
  }

  applySuggestedKeyword(keyword: string): void {
    this.searchTerm = keyword;
    this.onSearchSubmit();
  }

  async getCategoryTree() {
    try {
      this.categoryTree = await firstValueFrom(
        this.categoryApi.getCategoryTree()
      );
    } catch (error) {
      handleError(null, error);
    }
  }

  async getBrands(): Promise<void> {
    try {
      const brands = await firstValueFrom(this.brandApi.getBrands());
      this.brands = brands.map((brand) => ({ ...brand, checked: false }));
    } catch (error) {
      this.brands = [];
      handleError(null, error);
    }
  }

  updateFilterState(filters: any) {
    this.shopFilterState = { ...this.shopFilterState, ...filters };
  }

  async updateProductGrid(filters: any): Promise<void> {
    this.shopFilterState = { ...this.shopFilterState, ...filters };
    this.pageNumber = 1;
    await this.getProducts();
  }

  async onPageChange(page: number): Promise<void> {
    this.pageNumber = page;
    await this.getProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSort(sortingOption: string): void {
    let sortValue = 'newest';
    switch (sortingOption) {
      case 'Newest Arrivals':
        sortValue = 'newest';
        break;
      case 'Price: Low to High':
        sortValue = 'price_asc';
        break;
      case 'Price: High to Low':
        sortValue = 'price_desc';
        break;
      case 'Most Popular':
        sortValue = 'most_reviewed';
        break;
      case 'Rating: High to Low':
        sortValue = 'best_rated';
        break;
      default:
        sortValue = 'newest';
    }

    this.shopFilterState.sort = sortValue;
    this.shopFilterState.hideSortingOptions = true;
    this.pageNumber = 1;
    this.getProducts();
  }
}
