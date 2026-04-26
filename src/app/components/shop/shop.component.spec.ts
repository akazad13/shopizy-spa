import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { provideRouter } from '@angular/router';

import {
  COMMON_TEST_IMPORTS,
  createProductApiSpy,
  createCategoryApiSpy,
  createBrandApiSpy,
  provideSpy
} from '../../testing/test-helpers';
import { ProductApi } from '../../api/product.api';
import { CategoryApi } from '../../api/category.api';
import { BrandApi } from '../../api/brand.api';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(async () => {
    const productApiSpy = createProductApiSpy();
    const categoryApiSpy = createCategoryApiSpy();
    const brandApiSpy = createBrandApiSpy();

    await TestBed.configureTestingModule({
      imports: [ShopComponent, ...COMMON_TEST_IMPORTS],
      providers: [
        provideRouter([]),
        provideSpy(ProductApi, productApiSpy),
        provideSpy(CategoryApi, categoryApiSpy),
        provideSpy(BrandApi, brandApiSpy)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
