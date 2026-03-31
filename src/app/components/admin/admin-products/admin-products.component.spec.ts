import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsComponent } from './admin-products.component';
import { provideRouter } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { CategoryApi } from '../../../api/category.api';
import { ToastService } from '../../../services/toast.service';
import { of } from 'rxjs';

describe('AdminProductsComponent', () => {
  let component: AdminProductsComponent;
  let fixture: ComponentFixture<AdminProductsComponent>;

  beforeEach(async () => {
    const productApiMock = jasmine.createSpyObj('ProductApi', ['getProducts', 'deleteProduct']);
    const categoryApiMock = jasmine.createSpyObj('CategoryApi', ['getCategories']);
    const toastServiceMock = jasmine.createSpyObj('ToastService', ['success', 'error']);

    productApiMock.getProducts.and.returnValue(of({ items: [], totalCount: 0, totalPages: 0 }));
    categoryApiMock.getCategories.and.returnValue(of([]));

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
});
