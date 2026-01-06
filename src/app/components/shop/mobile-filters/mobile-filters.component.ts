import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { CategoryTree } from '../../../interfaces/category';
import { Color, ShopFilterState } from '../../../interfaces/shop';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';
import { Brand } from '../../../interfaces/brand';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mobile-filters',
  standalone: true,
  imports: [CommonModule, IconComponent, CategoryTreeComponent, FormsModule],
  templateUrl: './mobile-filters.component.html',
  styles: ``
})
export class MobileFiltersComponent {
  @Input() shopFilterState: ShopFilterState = {
    hideMobileFilters: true,
    selectedBrand: [],
    brandCollapsed: true,
    selectedCategory: [],
    categoryCollapsed: true,
    selectedColor: [],
    colorCollapsed: true,
    priceRange: 0,
    sort: '',
    showAll: false,
    hideSortingOptions: false,
    sortingOptions: []
  };
  @Input() brands: Brand[] = [];
  @Input() colors: Color[] = [];
  @Input() categoryTree: CategoryTree[] = [];

  @Output() hideMobileFiltersOutput = new EventEmitter<string>();
  @Output() updateFilterStateOutput = new EventEmitter<ShopFilterState>();
  @Output() updateProductGridOutput = new EventEmitter<ShopFilterState>();

  hideMobileDrawer(): void {
    this.shopFilterState.hideMobileFilters = true;
    this.hideMobileFiltersOutput.emit(
      this.shopFilterState.hideMobileFilters ? 'close' : 'open'
    );
  }

  updateCategoryCollapsed(): void {
    this.shopFilterState.categoryCollapsed =
      !this.shopFilterState.categoryCollapsed;
    this.updateFilterStateOutput.emit(this.shopFilterState);
  }
  updateBrandCollapsed(): void {
    this.shopFilterState.brandCollapsed = !this.shopFilterState.brandCollapsed;
  }
  updateColorCollapsed(): void {
    this.shopFilterState.colorCollapsed = !this.shopFilterState.colorCollapsed;
  }

  updateCategorySelection(category: CategoryTree) {
    this.updateSelectedCategory(category);
    this.updateProductGridOutput.emit(this.shopFilterState);
  }

  onBrandCheckboxChange(brand: Brand): void {
    if (brand.checked) {
      this.shopFilterState.selectedBrand.push(brand.id);
    } else {
      this.shopFilterState.selectedBrand =
        this.shopFilterState.selectedBrand.filter((b) => b !== brand.id);
    }
    this.updateProductGridOutput.emit(this.shopFilterState);
  }

  onColorCheckboxChange(color: Color): void {
    if (color.checked) {
      this.shopFilterState.selectedColor.push(color.name);
    } else {
      this.shopFilterState.selectedColor =
        this.shopFilterState.selectedColor.filter((c) => c !== color.name);
    }
    this.updateProductGridOutput.emit(this.shopFilterState);
  }

  private updateSelectedCategory(category: CategoryTree) {
    if (category.checked) {
      this.shopFilterState.selectedCategory.push(category.id);
      if (category.children) {
        category.children.forEach((child) => {
          this.updateSelectedCategory(child);
        });
      }
    } else {
      this.shopFilterState.selectedCategory =
        this.shopFilterState.selectedCategory.filter((c) => c !== category.id);
      if (category.children) {
        category.children.forEach((child) => {
          this.updateSelectedCategory(child);
        });
      }
    }
  }
}
