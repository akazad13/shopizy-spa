export interface ShopFilterState {
  hideMobileFilters: boolean;
  selectedBrand: string[];
  brandCollapsed: boolean;
  selectedCategory: string[];
  categoryCollapsed: boolean;
  selectedColor: string[];
  colorCollapsed: boolean;
  priceRange: number;
  sort: '';
  showAll: boolean;
  hideSortingOptions: boolean;
  sortingOptions: string[];
}
