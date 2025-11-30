import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryTree } from '../../../interfaces/category';

import { IconComponent } from '../../shared/icon/icon.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-tree',
  imports: [IconComponent, FormsModule],
  templateUrl: './category-tree.component.html',
  styles: ``
})
export class CategoryTreeComponent {
  @Input() categoryTree: CategoryTree[] = [];
  @Output() updateCategorySelection = new EventEmitter<CategoryTree>();

  toggleCategory(category: CategoryTree): void {
    category.expanded = !category.expanded;
  }

  onParentCheckboxChange(category: CategoryTree): void {
    if (category.children) {
      this.updateChildCheckboxes(category.children, category.checked);
    }
    this.updateCategorySelection.emit(category);
  }

  onChildCheckboxChange(category: CategoryTree): void {
    this.updateCategorySelection.emit(category);
  }

  private updateChildCheckboxes(
    children: CategoryTree[],
    isChecked: boolean
  ): void {
    children.forEach((child) => {
      child.checked = isChecked;
      if (child.children) {
        this.updateChildCheckboxes(child.children, isChecked);
      }
    });
  }
}
