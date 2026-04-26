import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AdminBrandsComponent } from './admin-brands.component';
import { BrandApi } from '../../../api/brand.api';
import { ToastService } from '../../../services/toast.service';

describe('AdminBrandsComponent', () => {
  let component: AdminBrandsComponent;
  let fixture: ComponentFixture<AdminBrandsComponent>;
  let brandApiMock: jasmine.SpyObj<BrandApi>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    brandApiMock = jasmine.createSpyObj('BrandApi', [
      'getBrands',
      'createBrand',
      'updateBrand',
      'deleteBrand'
    ]);
    toastServiceMock = jasmine.createSpyObj('ToastService', [
      'success',
      'error'
    ]);

    brandApiMock.getBrands.and.returnValue(of([]));
    brandApiMock.createBrand.and.returnValue(
      of({ id: 'brand-1', name: 'Nike', logoUrl: '', country: '' } as any)
    );
    brandApiMock.updateBrand.and.returnValue(of({ message: 'ok' }));
    brandApiMock.deleteBrand.and.returnValue(of({ message: 'ok' }));

    await TestBed.configureTestingModule({
      imports: [AdminBrandsComponent],
      providers: [
        { provide: BrandApi, useValue: brandApiMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load brands on init', () => {
    expect(brandApiMock.getBrands).toHaveBeenCalled();
    expect(component.brands).toEqual([]);
    expect(component.loading).toBeFalse();
  });

  it('should compute summary counts from brands', () => {
    component.brands = [
      { id: '1', name: 'Nike', logoUrl: 'x', country: 'US' },
      { id: '2', name: 'Adidas', logoUrl: '', country: '' },
      { id: '3', name: 'Puma', logoUrl: 'y', country: '' }
    ];

    expect(component.brandsWithLogoCount).toBe(2);
    expect(component.brandsWithCountryCount).toBe(1);
  });

  it('onAdd should show form in create mode with reset values', () => {
    component.brandForm = {
      id: '1',
      name: 'Old',
      logoUrl: 'img',
      country: 'US'
    };
    component.isEditMode = true;

    component.onAdd();

    expect(component.showForm).toBeTrue();
    expect(component.isEditMode).toBeFalse();
    expect(component.brandForm).toEqual({
      id: '',
      name: '',
      logoUrl: '',
      country: ''
    });
  });

  it('onEdit should populate form and switch to edit mode', () => {
    component.onEdit({
      id: 'brand-1',
      name: 'Nike',
      logoUrl: 'https://logo.svg',
      country: 'US'
    });

    expect(component.isEditMode).toBeTrue();
    expect(component.showForm).toBeTrue();
    expect(component.brandForm).toEqual({
      id: 'brand-1',
      name: 'Nike',
      logoUrl: 'https://logo.svg',
      country: 'US'
    });
  });

  it('onSubmit should create brand with trimmed payload in create mode', () => {
    spyOn(component, 'loadBrands');
    component.showForm = true;
    component.brandForm = {
      id: '',
      name: '  Nike  ',
      logoUrl: '  https://logo.svg  ',
      country: '  US  '
    };

    component.onSubmit();

    expect(brandApiMock.createBrand).toHaveBeenCalledWith({
      name: 'Nike',
      logoUrl: 'https://logo.svg',
      country: 'US'
    });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Brand created');
    expect(component.loadBrands).toHaveBeenCalled();
    expect(component.showForm).toBeFalse();
  });

  it('onSubmit should update brand in edit mode', () => {
    spyOn(component, 'loadBrands');
    component.isEditMode = true;
    component.brandForm = {
      id: 'brand-1',
      name: ' Nike ',
      logoUrl: ' img ',
      country: ' US '
    };

    component.onSubmit();

    expect(brandApiMock.updateBrand).toHaveBeenCalledWith('brand-1', {
      name: 'Nike',
      logoUrl: 'img',
      country: 'US'
    });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Brand updated');
    expect(component.loadBrands).toHaveBeenCalled();
  });

  it('onSubmit should skip api call when name is empty', () => {
    component.brandForm = {
      id: '',
      name: '   ',
      logoUrl: '',
      country: ''
    };

    component.onSubmit();

    expect(brandApiMock.createBrand).not.toHaveBeenCalled();
    expect(brandApiMock.updateBrand).not.toHaveBeenCalled();
  });

  it('onDelete should not call api if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.onDelete('brand-1');

    expect(brandApiMock.deleteBrand).not.toHaveBeenCalled();
  });

  it('onDelete should delete and reload when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'loadBrands');

    component.onDelete('brand-1');

    expect(brandApiMock.deleteBrand).toHaveBeenCalledWith('brand-1');
    expect(toastServiceMock.success).toHaveBeenCalledWith('Brand deleted');
    expect(component.loadBrands).toHaveBeenCalled();
  });

  it('should show error toast when loading brands fails', () => {
    brandApiMock.getBrands.and.returnValue(throwError(() => new Error('boom')));

    component.loadBrands();

    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Failed to load brands'
    );
    expect(component.loading).toBeFalse();
  });

  it('should show error toast when create fails', () => {
    brandApiMock.createBrand.and.returnValue(
      throwError(() => new Error('boom'))
    );
    component.brandForm = {
      id: '',
      name: 'Nike',
      logoUrl: '',
      country: ''
    };

    component.onSubmit();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Error creating brand');
  });

  it('should show error toast when update fails', () => {
    brandApiMock.updateBrand.and.returnValue(
      throwError(() => new Error('boom'))
    );
    component.isEditMode = true;
    component.brandForm = {
      id: 'brand-1',
      name: 'Nike',
      logoUrl: '',
      country: ''
    };

    component.onSubmit();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Error updating brand');
  });

  it('should show error toast when delete fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    brandApiMock.deleteBrand.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.onDelete('brand-1');

    expect(toastServiceMock.error).toHaveBeenCalledWith('Error deleting brand');
  });
});
