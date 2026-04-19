import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
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
  categories: CategoryTree[] = []; // flat list for dropdown
  brands: any[] = [];

  // For image management in edit mode
  existingImages: { productImageId: string; imageUrl: string }[] = [];
  uploadingImage: boolean = false;
  selectedImageFile: File | null = null;

  // For color and size checkboxes
  availableColorsList: string[] = [
    'Red',
    'Blue',
    'Green',
    'Black',
    'White',
    'Yellow',
    'Pink',
    'Purple',
    'Orange',
    'Gray',
    'Brown',
    'Cyan',
    'Magenta'
  ];
  availableSizesList: string[] = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '3XL',
    'One Size'
  ];
  selectedColors: string[] = [];
  selectedSizes: string[] = [];

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
      sku: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      tagsText: ['']
    });
  }

  loadCategories(): void {
    this.categoryApi.getCategoryTree().subscribe({
      next: (cats) => {
        this.categories = this.flattenCategories(cats);
      },
      error: () => this.toast.error('Failed to load categories')
    });
  }

  flattenCategories(nodes: CategoryTree[], depth = 0): CategoryTree[] {
    const result: CategoryTree[] = [];
    for (const node of nodes) {
      result.push({ ...node, name: '\u00a0'.repeat(depth * 3) + node.name });
      if (node.children && node.children.length) {
        result.push(...this.flattenCategories(node.children, depth + 1));
      }
    }
    return result;
  }

  loadBrands(): void {
    this.productApi
      .getBrands()
      .pipe(
        map((res: any) => {
          if (Array.isArray(res)) return res;
          if (res?.$values) return res.$values;
          return [];
        })
      )
      .subscribe({
        next: (brands) => (this.brands = brands),
        error: () => this.toast.error('Failed to load brands')
      });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productApi.getProduct(id).subscribe({
      next: (product) => {
        this.existingImages = product.productImages || [];

        this.productForm.patchValue({
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          categoryId: product.categoryId || '',
          brandId: product.brand?.id || null,
          sku: product.sku || '',
          unitPrice: Number((product as any).unitPrice ?? product.price ?? 0),
          discount: +product.discount || 0,
          stockQuantity: +product.stockQuantity || 0,
          tagsText: product.tags || ''
        });

        // Set selected colors and sizes
        if (typeof product.colors === 'string') {
          this.selectedColors = this.splitCommaSeparated(product.colors);
        } else if (Array.isArray(product.colors)) {
          this.selectedColors = product.colors;
        }

        if (typeof product.sizes === 'string') {
          this.selectedSizes = this.splitCommaSeparated(product.sizes);
        } else if (Array.isArray(product.sizes)) {
          this.selectedSizes = product.sizes;
        }

        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load product details');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  splitCommaSeparated(val: string): string[] {
    return val
      .split(',')
      .map((s) => s.trim())
      .filter((s) => !!s);
  }

  onColorToggle(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index === -1) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors.splice(index, 1);
    }
  }

  onSizeToggle(size: string): void {
    const index = this.selectedSizes.indexOf(size);
    if (index === -1) {
      this.selectedSizes.push(size);
    } else {
      this.selectedSizes.splice(index, 1);
    }
  }

  isColorSelected(color: string): boolean {
    return this.selectedColors.includes(color);
  }

  isSizeSelected(size: string): boolean {
    return this.selectedSizes.includes(size);
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
    this.productApi
      .addProductImage(this.productId, this.selectedImageFile)
      .subscribe({
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
        this.existingImages = this.existingImages.filter(
          (i) => i.productImageId !== imageId
        );
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
      sku: v.sku,
      price: Number(v.unitPrice),
      unitPrice: Number(v.unitPrice),
      discount: Number(v.discount),
      stockQuantity: Number(v.stockQuantity),
      colors: this.selectedColors.join(','),
      sizes: this.selectedSizes.join(','),
      tags: v.tagsText,
      images: this.existingImages.map((i) => i.productImageId)
    };

    if (this.isEditMode && this.productId) {
      const updatePayload = { ...payload, productId: this.productId };
      this.productApi
        .updateProduct(this.productId, updatePayload as any)
        .subscribe({
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
