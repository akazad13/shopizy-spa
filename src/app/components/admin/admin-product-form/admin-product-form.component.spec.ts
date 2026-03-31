import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductFormComponent } from './admin-product-form.component';
import { provideRouter } from '@angular/router';
import { ProductApi } from '../../../api/product.api';
import { CategoryApi } from '../../../api/category.api';
import { ToastService } from '../../../services/toast.service';
import { of } from 'rxjs';

describe('AdminProductFormComponent', () => {
  let component: AdminProductFormComponent;
  let fixture: ComponentFixture<AdminProductFormComponent>;

  beforeEach(async () => {
    const productApiMock = jasmine.createSpyObj('ProductApi', ['getBrands', 'getProduct', 'createProduct', 'updateProduct', 'addProductImage', 'deleteProductImage']);
    const categoryApiMock = jasmine.createSpyObj('CategoryApi', ['getCategoryTree']);
    const toastServiceMock = jasmine.createSpyObj('ToastService', ['success', 'error']);

    productApiMock.getBrands.and.returnValue(of([]));
    productApiMock.getProduct.and.returnValue(of({ name: '', price: 0, stockQuantity: 0 }));
    categoryApiMock.getCategoryTree.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AdminProductFormComponent],
      providers: [
        { provide: ProductApi, useValue: productApiMock },
        { provide: CategoryApi, useValue: categoryApiMock },
        { provide: ToastService, useValue: toastServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
