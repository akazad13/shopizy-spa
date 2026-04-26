export interface ShopFilterState {
  hideMobileFilters: boolean;
  selectedBrand: string[];
  brandCollapsed: boolean;
  selectedCategory: string[];
  categoryCollapsed: boolean;
  selectedColor: string[];
  priceRange: number;
  sort: string;
  showAll: boolean;
  hideSortingOptions: boolean;
  sortingOptions: string[];
}

export interface Color {
  name: string;
  checked?: boolean;
}
