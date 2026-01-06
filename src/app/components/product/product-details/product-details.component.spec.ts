import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CartService } from '../../../services/cart.service';
import {
  COMMON_TEST_IMPORTS,
  createCartServiceStub
} from '../../../testing/test-helpers';

import { ProductDetailsComponent } from './product-details.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    const cartServiceStub = createCartServiceStub();

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent, ...COMMON_TEST_IMPORTS],
      providers: [
        { provide: CartService, useValue: cartServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            data: {
              subscribe: (fn: any) => {
                fn({
                  product: {
                    productId: '1',
                    name: 'Test Product',
                    shortDescription: '',
                    description: '',
                    categoryId: '',
                    price: 0,
                    discount: 0,
                    brand: null,
                    colors: '',
                    sizes: '',
                    tags: [],
                    barcode: null,
                    stockQuantity: 0,
                    averageRating: { value: 0, numRatings: 0 },
                    productImages: null,
                    sku: null,
                    favourites: 0,
                    specifications: null,
                    productReviews: []
                  }
                });
                return {
                  unsubscribe() {
                    return undefined;
                  }
                };
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    // Pre-assign product to avoid template accessing null before route data arrives
    component.product = {
      productId: '1',
      name: 'Test Product',
      shortDescription: '',
      description: '',
      categoryId: '',
      price: 0,
      discount: 0,
      brand: null,
      colors: '',
      sizes: '',
      tags: [],
      barcode: null,
      stockQuantity: 0,
      averageRating: { value: 0, numRatings: 0 },
      productImages: null,
      sku: null,
      favourites: 0,
      specifications: null,
      productReviews: []
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
