import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandApi } from '../../../api/brand.api';
import { Brand } from '../../../interfaces/brand';
import { ToastService } from '../../../services/toast.service';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent, ConfirmModalComponent],
  templateUrl: './admin-brands.component.html'
})
export class AdminBrandsComponent implements OnInit {
  brands: Brand[] = [];
  loading = true;
  showForm = false;
  isEditMode = false;

  confirmModalOpen = false;
  confirmModalTitle = 'Delete Brand';
  confirmModalMessage = '';
  brandToDeleteId: string | null = null;

  get brandsWithLogoCount(): number {
    return this.brands.filter((brand) => !!brand.logoUrl).length;
  }

  get brandsWithCountryCount(): number {
    return this.brands
      .filter((brand) => !!brand.country)
      .map((brand) => brand.country)
      .filter((value, index, self) => self.indexOf(value) === index).length;
  }

  brandForm = {
    id: '',
    name: '',
    logoUrl: '',
    country: ''
  };

  constructor(
    private readonly brandApi: BrandApi,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.brandApi.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load brands');
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.brandForm = {
      id: '',
      name: '',
      logoUrl: '',
      country: ''
    };
    this.isEditMode = false;
    this.showForm = false;
  }

  onAdd(): void {
    this.resetForm();
    this.showForm = true;
  }

  onEdit(brand: Brand): void {
    this.brandForm = {
      id: brand.id,
      name: brand.name || '',
      logoUrl: brand.logoUrl || '',
      country: brand.country || ''
    };
    this.isEditMode = true;
    this.showForm = true;
  }

  onDelete(brandId: string, name?: string): void {
    this.brandToDeleteId = brandId;
    this.confirmModalTitle = 'Delete Brand';
    this.confirmModalMessage = `Are you sure you want to delete "${name || 'this brand'}"? This action cannot be undone.`;
    this.confirmModalOpen = true;
  }

  confirmDeleteBrand(): void {
    if (!this.brandToDeleteId) return;
    const id = this.brandToDeleteId;
    this.confirmModalOpen = false;
    this.brandToDeleteId = null;

    this.brandApi.deleteBrand(id).subscribe({
      next: () => {
        this.toast.success('Brand deleted');
        this.loadBrands();
      },
      error: () => this.toast.error('Error deleting brand')
    });
  }

  cancelDeleteBrand(): void {
    this.confirmModalOpen = false;
    this.brandToDeleteId = null;
  }

  onSubmit(): void {
    if (!this.brandForm.name.trim()) return;

    const payload = {
      name: this.brandForm.name.trim(),
      logoUrl: this.brandForm.logoUrl.trim(),
      country: this.brandForm.country.trim()
    };

    if (this.isEditMode) {
      this.brandApi.updateBrand(this.brandForm.id, payload).subscribe({
        next: () => {
          this.toast.success('Brand updated');
          this.loadBrands();
          this.resetForm();
        },
        error: () => this.toast.error('Error updating brand')
      });
      return;
    }

    this.brandApi.createBrand(payload).subscribe({
      next: () => {
        this.toast.success('Brand created');
        this.loadBrands();
        this.resetForm();
      },
      error: () => this.toast.error('Error creating brand')
    });
  }
}
