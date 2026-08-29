import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { Product } from '../../../interfaces/product';
import { ProductQueryFilters } from '../../../models/QueryFilters';
import { ToastService } from '../../../services/toast.service';
import { CategoryApi } from '../../../api/category.api';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginationComponent,
    SkeletonLoaderComponent,
    ConfirmModalComponent
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  loading: boolean = true;
  filters = new ProductQueryFilters();
  totalPages = 1;

  // Search controls (bound via ngModel)
  searchName: string = '';
  selectedCategoryId: string = '';

  confirmModalOpen = false;
  confirmModalTitle = 'Delete Product';
  confirmModalMessage = '';
  productToDeleteId: string | null = null;

  constructor(
    private productApi: ProductApi,
    private categoryApi: CategoryApi,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filters.pageSize = 10;
    this.loadCategories();

    this.route.queryParams.subscribe((params) => {
      if (params['name']) {
        this.searchName = params['name'];
        this.filters.name = params['name'];
      } else {
        this.searchName = '';
        this.filters.name = null;
      }
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.categoryApi.getCategories().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.categories = res;
        } else if ((res as any)?.$values) {
          this.categories = (res as any).$values;
        } else {
          this.categories = [];
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  getCategoryName(id: string): string {
    const cat = this.categories.find((c) => c.id === id);
    return cat ? cat.name : 'Uncategorized';
  }

  loadProducts(): void {
    this.loading = true;
    this.productApi.getProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res.items;

        // Use backend's totalPages if provided, otherwise estimate it
        if (res.totalPages && res.totalPages > 1) {
          this.totalPages = res.totalPages;
        } else {
          // Estimate logic: if page is full, assume there's at least one more page
          this.totalPages =
            this.products.length >= this.filters.pageSize
              ? this.filters.pageNumber + 1
              : this.filters.pageNumber;
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load products');
      }
    });
  }

  applySearch(): void {
    this.filters.pageNumber = 1;
    this.filters.name = this.searchName.trim() || null;
    this.filters.categoryIds = this.selectedCategoryId
      ? [this.selectedCategoryId]
      : null;
    this.loadProducts();
  }

  clearSearch(): void {
    this.searchName = '';
    this.selectedCategoryId = '';
    this.filters.name = null;
    this.filters.categoryIds = null;
    this.filters.pageNumber = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.filters.pageNumber = page;
    this.loadProducts();
  }

  getProductId(product: any): string {
    return product?.productId || product?.id || '';
  }

  getProductImageUrl(product: any): string | null {
    if (!product) return null;
    let imgs = product.productImages;
    if (imgs && (imgs as any).$values) {
      imgs = (imgs as any).$values;
    }
    if (Array.isArray(imgs) && imgs.length > 0) {
      return typeof imgs[0] === 'string' ? imgs[0] : (imgs[0]?.imageUrl || null);
    }
    return null;
  }

  deleteProduct(productId: string, name?: string): void {
    this.productToDeleteId = productId;
    this.confirmModalTitle = 'Delete Product';
    this.confirmModalMessage = `Are you sure you want to delete "${name || 'this product'}"? This action cannot be undone.`;
    this.confirmModalOpen = true;
  }

  confirmDeleteProduct(): void {
    if (!this.productToDeleteId) return;
    const id = this.productToDeleteId;
    this.confirmModalOpen = false;
    this.productToDeleteId = null;

    this.productApi.deleteProduct(id).subscribe({
      next: () => {
        this.toast.success('Product deleted successfully');
        this.loadProducts();
      },
      error: () => {
        this.toast.error('Could not delete product');
      }
    });
  }

  cancelDeleteProduct(): void {
    this.confirmModalOpen = false;
    this.productToDeleteId = null;
  }
}
