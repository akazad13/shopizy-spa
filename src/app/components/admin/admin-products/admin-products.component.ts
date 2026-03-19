import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { Product } from '../../../interfaces/product';
import { ProductQueryFilters } from '../../../models/QueryFilters';
import { ToastService } from '../../../services/toast.service';

import { CategoryApi } from '../../../api/category.api';
import { CategoryTree } from '../../../interfaces/category';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  loading: boolean = true;
  filters = new ProductQueryFilters();
  totalPages = 1;

  constructor(
    private productApi: ProductApi, 
    private categoryApi: CategoryApi,
    private toast: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.filters.pageSize = 10;
    await this.loadCategories();
    await this.loadProducts();
  }

  async loadCategories() {
    try {
      this.categories = await new Promise((resolve, reject) => {
        this.categoryApi.getCategories().subscribe({
          next: (res) => resolve(res),
          error: (err) => reject(err)
        });
      });
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  }

  getCategoryName(id: string): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'Uncategorized';
  }

  loadProducts(): void {
    this.loading = true;
    this.productApi.getProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res;
        // Mock total pages since API returns array. 
        // In a real app, the API should return a wrapper with totalCount.
        // We'll assume a large enough number or use the results length if it's the last page.
        this.totalPages = res.length === this.filters.pageSize ? this.filters.pageNumber + 1 : this.filters.pageNumber;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load products');
      }
    });
  }

  onPageChange(page: number) {
    this.filters.pageNumber = page;
    this.loadProducts();
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productApi.deleteProduct(productId).subscribe({
        next: () => {
          this.toast.success('Product deleted successfully');
          this.loadProducts(); // refresh table
        },
        error: () => {
          this.toast.error('Could not delete product');
        }
      });
    }
  }
}
