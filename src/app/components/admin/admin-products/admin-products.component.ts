import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { Product } from '../../../interfaces/product';
import { ProductQueryFilters } from '../../../models/QueryFilters';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;

  constructor(private productApi: ProductApi, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const filters = new ProductQueryFilters();
    filters.pageNumber = 1;
    filters.pageSize = 50;
    
    this.productApi.getProducts(filters).subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load products');
      }
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you confirm you want to delete this product?')) {
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
