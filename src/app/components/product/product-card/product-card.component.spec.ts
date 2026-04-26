import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { provideRouter } from '@angular/router';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    // Provide minimal product input to avoid undefined accesses in template
    component.product = {
      productId: '1',
      name: 'Test',
      shortDescription: '',
      description: '',
      categoryId: '',
      price: 0,
      discount: 0,
      brandId: null,
      colors: '',
      sizes: '',
      tags: null,
      barcode: null,
      stockQuantity: 0,
      averageRating: { value: 0, numRatings: 0 },
      productImages: null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
