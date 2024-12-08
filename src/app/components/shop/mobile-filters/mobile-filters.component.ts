import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { CategoryTree } from '../../../interfaces/category';
import { ShopFilterState } from '../../../interfaces/shop';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';

@Component({
  selector: 'app-mobile-filters',
  imports: [CommonModule, IconComponent, CategoryTreeComponent],
  templateUrl: './mobile-filters.component.html',
  styles: ``
})
export class MobileFiltersComponent {
  @Input() shopFilterState!: ShopFilterState;
  @Input() brands: string[] = [];
  @Input() colors: string[] = [];
  @Input() categoryTree: CategoryTree[] = [];

  @Output() hideMobileFiltersOutput = new EventEmitter<string>();
  @Output() updateFilterStateOutput = new EventEmitter<ShopFilterState>();
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
}
