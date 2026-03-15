import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { ToastService } from '../../../services/toast.service';
import { CategoryApi } from '../../../api/category.api';
import { CategoryTree } from '../../../interfaces/category';

@Component({
  selector: 'app-admin-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: string | null = null;
  loading: boolean = false;
  categories: CategoryTree[] = [];

  constructor(
    private fb: FormBuilder,
    private productApi: ProductApi,
    private categoryApi: CategoryApi,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      brandId: [null],
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      colors: [[]],
      sizes: [[]],
      tags: [[]],
      images: [[]]
    });
  }

  loadCategories(): void {
    this.categoryApi.getcategoryTree().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.toast.error('Failed to load categories')
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productApi.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          categoryId: product.categoryId,
          brandId: product.brand?.id || null,
          price: product.price,
          discount: product.discount,
          stockQuantity: product.stockQuantity,
          colors: product.colors ? product.colors.split(',') : [],
          sizes: product.sizes ? product.sizes.split(',') : [],
          tags: product.tags || [],
          images: product.productImages?.map(img => img.imageUrl) || []
        });
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load product details');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  // --- Helpers for simple array inputs mapped to strings (comma separated inputs) ---
  get colorsText(): string { return this.productForm.get('colors')?.value.join(', ') || ''; }
  setColors(event: any): void {
    const val = event.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    this.productForm.patchValue({ colors: val });
  }

  get sizesText(): string { return this.productForm.get('sizes')?.value.join(', ') || ''; }
  setSizes(event: any): void {
    const val = event.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    this.productForm.patchValue({ sizes: val });
  }

  get imagesText(): string { return this.productForm.get('images')?.value.join(', ') || ''; }
  setImages(event: any): void {
    const val = event.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    this.productForm.patchValue({ images: val });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.toast.error('Please fill all required fields correctly.');
      return;
    }

    this.loading = true;
    const payload = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productApi.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.toast.success('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: () => {
          this.toast.error('Error updating product.');
          this.loading = false;
        }
      });
    } else {
      this.productApi.createProduct(payload).subscribe({
        next: () => {
          this.toast.success('Product created successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: () => {
          this.toast.error('Error creating product.');
          this.loading = false;
        }
      });
    }
  }
}
