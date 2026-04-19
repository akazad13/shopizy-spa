import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryApi } from '../../../api/category.api';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html'
})
export class AdminCategoriesComponent implements OnInit {
  categories: any[] = [];
  categoryTree: any[] = [];
  loading = true;
  topLevelCategories = 0;
  categoryForm = {
    id: '',
    name: '',
    description: '',
    parentId: null
  };
  isEditMode = false;
  showForm = false;

  constructor(
    private categoryApi: CategoryApi,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryApi.getCategories().subscribe({
      next: (res) => {
        this.categories = Array.isArray(res)
          ? res
          : ((res as any)?.$values ??
            (res as any)?.items?.$values ??
            (res as any)?.items ??
            []);
        this.topLevelCategories = this.categories.filter(
          (c) => !c.parentId
        ).length;
        this.buildTree();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load categories');
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.categoryForm = { id: '', name: '', description: '', parentId: null };
    this.isEditMode = false;
    this.showForm = false;
  }

  onAdd() {
    this.resetForm();
    this.showForm = true;
  }

  onEdit(cat: any) {
    this.categoryForm = {
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      parentId: cat.parentId
    };
    this.isEditMode = true;
    this.showForm = true;
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryApi.deleteCategory(id).subscribe({
        next: () => {
          this.toast.success('Category deleted');
          this.loadCategories();
        },
        error: () => this.toast.error('Error deleting category')
      });
    }
  }

  buildTree(): void {
    const map = new Map<string, any>();
    const roots: any[] = [];

    // Create entries with expanded state and children array
    this.categories.forEach((cat) => {
      map.set(cat.id, {
        ...cat,
        children: [],
        expanded: false
      });
    });

    // Build parent-child relationships
    this.categories.forEach((cat) => {
      const node = map.get(cat.id);
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    this.categoryTree = roots;
  }

  toggleExpanded(node: any): void {
    node.expanded = !node.expanded;
  }

  onSubmit() {
    if (!this.categoryForm.name) return;

    const payload = {
      name: this.categoryForm.name,
      description: this.categoryForm.description,
      parentId: this.categoryForm.parentId
    };

    if (this.isEditMode) {
      this.categoryApi.updateCategory(this.categoryForm.id, payload).subscribe({
        next: () => {
          this.toast.success('Category updated');
          this.loadCategories();
          this.resetForm();
        },
        error: () => this.toast.error('Error updating category')
      });
    } else {
      this.categoryApi.createCategory(payload).subscribe({
        next: () => {
          this.toast.success('Category created');
          this.loadCategories();
          this.resetForm();
        },
        error: () => this.toast.error('Error creating category')
      });
    }
  }
}
