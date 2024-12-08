import { Component, Input } from '@angular/core';
import { CategoryTree } from '../../../interfaces/category';
import { NgFor, NgIf } from '@angular/common';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-category-tree',
  imports: [NgFor, NgIf, IconComponent],
  templateUrl: './category-tree.component.html',
  styles: ``
})
export class CategoryTreeComponent {
  @Input() categoryTree: CategoryTree[] = [];

  toggleCategory(category: CategoryTree): void {
    category.expanded = !category.expanded; // Toggle the expanded flag
  }
}
