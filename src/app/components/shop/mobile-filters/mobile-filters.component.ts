import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { CategoryTree } from '../../../interfaces/category';

@Component({
    selector: 'app-mobile-filters',
    imports: [CommonModule, IconComponent],
    templateUrl: './mobile-filters.component.html',
    styles: ``
})
export class MobileFiltersComponent {
  @Input() hideMobileFilters: boolean = false;
  @Input() filterState: any;
  @Input() brands: string[] = [];
  @Input() colors: string[] = [];
  @Input() categoriesTree: CategoryTree[] = [];

  @Output() hideMobileFiltersOutput = new EventEmitter<string>();
  @Output() updateFilterStateOutput = new EventEmitter<any>();
  hideMobileDrawer(): void {
    this.hideMobileFilters = true;
    this.hideMobileFiltersOutput.emit(
      this.hideMobileFilters ? 'close' : 'open'
    );
  }

  updateCategoryCollapsed(): void {
    this.filterState.categoryCollapsed = !this.filterState.categoryCollapsed;
    this.updateFilterStateOutput.emit(this.filterState);
  }
  updateBrandCollapsed(): void {
    this.filterState.brandCollapsed = !this.filterState.brandCollapsed;
  }
  updateColorCollapsed(): void {
    this.filterState.colorCollapsed = !this.filterState.colorCollapsed;
  }
}
