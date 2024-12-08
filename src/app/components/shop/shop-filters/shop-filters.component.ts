import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { NgFor, NgIf } from '@angular/common';
import { CategoryTree } from '../../../interfaces/category';
import { ShopFilterState } from '../../../interfaces/shop';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';

@Component({
  selector: 'app-shop-filters',
  imports: [IconComponent, NgIf, NgFor, CategoryTreeComponent],
  templateUrl: './shop-filters.component.html',
  styles: ``
})
export class ShopFiltersComponent {
  @Input() shopFilterState!: ShopFilterState;
  @Input() brands: string[] = [];
  @Input() colors: string[] = [];
  @Input() categoryTree: CategoryTree[] = [];

  @Output() updateFilterStateOutput = new EventEmitter<ShopFilterState>();

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
}
