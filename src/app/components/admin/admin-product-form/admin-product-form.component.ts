import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { ToastService } from '../../../services/toast.service';
import { CategoryApi } from '../../../api/category.api';
import { CategoryTree } from '../../../interfaces/category';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  categories: CategoryTree[] = [];
  brands: any[] = [];

  // For image management in edit mode
  existingImages: { productImageId: string; imageUrl: string }[] = [];
  uploadingImage: boolean = false;
  selectedImageFile: File | null = null;

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
    this.loadBrands();

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(300)]],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      brandId: [null],
      price: [0, [Validators.required, Validators.min(0.01)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      colorsText: [''],
      sizesText: [''],
      tagsText: [''],
    });
  }

  loadCategories(): void {
    this.categoryApi.getcategoryTree().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.toast.error('Failed to load categories')
    });
  }

  loadBrands(): void {
    this.productApi.getBrands().pipe(
      map((res: any) => {
        if (Array.isArray(res)) return res;
        if (res?.$values) return res.$values;
        return [];
      })
    ).subscribe({
      next: (brands) => this.brands = brands,
      error: () => this.toast.error('Failed to load brands')
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productApi.getProduct(id).subscribe({
      next: (product) => {
        this.existingImages = product.productImages || [];
        this.productForm.patchValue({
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          categoryId: product.categoryId,
          brandId: product.brand?.id || null,
          price: product.price,
          discount: product.discount,
          stockQuantity: product.stockQuantity,
          colorsText: product.colors || '',
          sizesText: product.sizes || '',
          tagsText: product.tags ? product.tags.join(', ') : '',
        });
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load product details');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  splitCommaSeparated(val: string): string[] {
    return val.split(',').map(s => s.trim()).filter(s => !!s);
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (!this.productId || !this.selectedImageFile) return;
    this.uploadingImage = true;
    this.productApi.addProductImage(this.productId, this.selectedImageFile).subscribe({
      next: (img) => {
        this.existingImages.push(img);
        this.selectedImageFile = null;
        this.uploadingImage = false;
        this.toast.success('Image uploaded successfully');
      },
      error: () => {
        this.uploadingImage = false;
        this.toast.error('Failed to upload image');
      }
    });
  }

  deleteImage(imageId: string): void {
    if (!this.productId) return;
    if (!confirm('Remove this image?')) return;
    this.productApi.deleteProductImage(this.productId, imageId).subscribe({
      next: () => {
        this.existingImages = this.existingImages.filter(i => i.productImageId !== imageId);
        this.toast.success('Image removed');
      },
      error: () => this.toast.error('Failed to remove image')
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.toast.error('Please fill all required fields correctly.');
      return;
    }

    this.submitting = true;
    const v = this.productForm.value;

    const payload = {
      name: v.name,
      shortDescription: v.shortDescription,
      description: v.description,
      categoryId: v.categoryId,
      brandId: v.brandId || null,
      price: Number(v.price),
      discount: Number(v.discount),
      stockQuantity: Number(v.stockQuantity),
      colors: this.splitCommaSeparated(v.colorsText),
      sizes: this.splitCommaSeparated(v.sizesText),
      tags: this.splitCommaSeparated(v.tagsText),
      images: []
    };

    if (this.isEditMode && this.productId) {
      this.productApi.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.toast.success('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: () => {
          this.toast.error('Error updating product.');
          this.submitting = false;
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
          this.submitting = false;
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.productForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
