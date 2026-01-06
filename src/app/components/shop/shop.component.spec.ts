import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { provideRouter } from '@angular/router';

import {
  COMMON_TEST_IMPORTS,
  createProductApiSpy,
  createCategoryApiSpy,
  provideSpy
} from '../../testing/test-helpers';
import { ProductApi } from '../../api/product.api';
import { CategoryApi } from '../../api/category.api';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(async () => {
    const productApiSpy = createProductApiSpy();
    const categoryApiSpy = createCategoryApiSpy();

    await TestBed.configureTestingModule({
      imports: [ShopComponent, ...COMMON_TEST_IMPORTS],
      providers: [
        provideRouter([]),
        provideSpy(ProductApi, productApiSpy),
        provideSpy(CategoryApi, categoryApiSpy)
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
