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
  loading = true;
  categoryForm = {
    id: '',
    name: '',
    description: '',
    parentId: null
  };
  isEditMode = false;
  showForm = false;

  constructor(private categoryApi: CategoryApi, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryApi.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
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
