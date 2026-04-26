import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsComponent } from './admin-products.component';
import { provideRouter } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { CategoryApi } from '../../../api/category.api';
import { ToastService } from '../../../services/toast.service';
import { of, throwError } from 'rxjs';

describe('AdminProductsComponent', () => {
  let component: AdminProductsComponent;
  let fixture: ComponentFixture<AdminProductsComponent>;
  let productApiMock: jasmine.SpyObj<ProductApi>;
  let categoryApiMock: jasmine.SpyObj<CategoryApi>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    productApiMock = jasmine.createSpyObj('ProductApi', [
      'getProducts',
      'deleteProduct'
    ]);
    categoryApiMock = jasmine.createSpyObj('CategoryApi', ['getCategories']);
    toastServiceMock = jasmine.createSpyObj('ToastService', [
      'success',
      'error'
    ]);

    productApiMock.getProducts.and.returnValue(
      of({ items: [], totalCount: 0, totalPages: 0 })
    );
    categoryApiMock.getCategories.and.returnValue(of([]));
    productApiMock.deleteProduct.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [AdminProductsComponent],
      providers: [
        { provide: ProductApi, useValue: productApiMock },
        { provide: CategoryApi, useValue: categoryApiMock },
        { provide: ToastService, useValue: toastServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with page size 10 and load data', () => {
    expect(component.filters.pageSize).toBe(10);
    expect(categoryApiMock.getCategories).toHaveBeenCalled();
    expect(productApiMock.getProducts).toHaveBeenCalled();
  });

  it('loadCategories should accept plain array payload', () => {
    categoryApiMock.getCategories.and.returnValue(
      of([{ id: 'cat-1', name: 'Shoes' }] as any)
    );

    component.loadCategories();

    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Shoes');
  });

  it('loadCategories should accept $values payload', () => {
    categoryApiMock.getCategories.and.returnValue(
      of({ $values: [{ id: 'cat-2', name: 'Bags' }] } as any)
    );

    component.loadCategories();

    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Bags');
  });

  it('getCategoryName should return category label or fallback', () => {
    component.categories = [{ id: 'cat-1', name: 'Shoes' }];

    expect(component.getCategoryName('cat-1')).toBe('Shoes');
    expect(component.getCategoryName('missing')).toBe('Uncategorized');
  });

  it('loadProducts should use backend totalPages when greater than 1', () => {
    productApiMock.getProducts.and.returnValue(
      of({ items: [{ id: 'p1' }], totalPages: 7 } as any)
    );

    component.loadProducts();

    expect(component.products.length).toBe(1);
    expect(component.totalPages).toBe(7);
    expect(component.loading).toBeFalse();
  });

  it('loadProducts should estimate totalPages when backend totalPages is missing', () => {
    component.filters.pageNumber = 2;
    component.filters.pageSize = 2;
    productApiMock.getProducts.and.returnValue(
      of({ items: [{ id: 'p1' }, { id: 'p2' }], totalPages: 0 } as any)
    );

    component.loadProducts();

    expect(component.totalPages).toBe(3);
  });

  it('loadProducts should show toast on failure', () => {
    productApiMock.getProducts.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.loadProducts();

    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Failed to load products'
    );
    expect(component.loading).toBeFalse();
  });

  it('applySearch should set filters and reload from first page', () => {
    spyOn(component, 'loadProducts');
    component.filters.pageNumber = 5;
    component.searchName = '  Nike  ';
    component.selectedCategoryId = 'cat-9';

    component.applySearch();

    expect(component.filters.pageNumber).toBe(1);
    expect(component.filters.name).toBe('Nike');
    expect(component.filters.categoryIds).toEqual(['cat-9']);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('clearSearch should reset search criteria and reload', () => {
    spyOn(component, 'loadProducts');
    component.searchName = 'Nike';
    component.selectedCategoryId = 'cat-9';
    component.filters.name = 'Nike';
    component.filters.categoryIds = ['cat-9'];
    component.filters.pageNumber = 4;

    component.clearSearch();

    expect(component.searchName).toBe('');
    expect(component.selectedCategoryId).toBe('');
    expect(component.filters.name).toBeNull();
    expect(component.filters.categoryIds).toBeNull();
    expect(component.filters.pageNumber).toBe(1);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('onPageChange should update page and reload', () => {
    spyOn(component, 'loadProducts');

    component.onPageChange(3);

    expect(component.filters.pageNumber).toBe(3);
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('deleteProduct should not call api if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteProduct('p-1');

    expect(productApiMock.deleteProduct).not.toHaveBeenCalled();
  });

  it('deleteProduct should delete and reload when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'loadProducts');

    component.deleteProduct('p-2');

    expect(productApiMock.deleteProduct).toHaveBeenCalledWith('p-2');
    expect(toastServiceMock.success).toHaveBeenCalledWith(
      'Product deleted successfully'
    );
    expect(component.loadProducts).toHaveBeenCalled();
  });

  it('deleteProduct should show error toast on failure', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    productApiMock.deleteProduct.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.deleteProduct('p-2');

    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Could not delete product'
    );
  });
});
