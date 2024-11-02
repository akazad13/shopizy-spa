import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { NgFor, NgIf } from '@angular/common';
import { CategoryTree } from '../../../interfaces/category';
import { ToIterablePipe } from '../../../pipes/to-iterable.pipe';

@Component({
  selector: 'app-shop-filters',
  standalone: true,
  imports: [IconComponent, NgIf, NgFor, ToIterablePipe],
  templateUrl: './shop-filters.component.html',
  styles: ``
})
export class ShopFiltersComponent {
  @Input() filterState: any;
  @Input() brands: string[] = [];
  @Input() colors: string[] = [];
  @Input() categoriesTree: CategoryTree[] = [];

  @Output() updateFilterStateOutput = new EventEmitter<any>();

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
