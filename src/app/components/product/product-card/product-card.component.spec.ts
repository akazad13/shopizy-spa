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

  it('should display the correct price when discount is undefined', () => {
    component.product = {
      productId: 'p-1',
      name: 'Sample Item',
      shortDescription: '',
      description: '',
      categoryId: 'c-1',
      price: 49.99,
      discount: undefined as any,
      brandId: null,
      colors: '',
      sizes: '',
      tags: null,
      barcode: null,
      stockQuantity: 10,
      averageRating: { value: 4.5, numRatings: 10 },
      productImages: null
    };
    fixture.detectChanges();

    expect(component.finalPrice).toBe(49.99);
    expect(component.hasDiscount).toBeFalse();

    const compiled = fixture.nativeElement as HTMLElement;
    const priceText = compiled.querySelector('.text-lg.font-bold')?.textContent?.trim();
    expect(priceText).toBe('$49.99');
  });

  it('should calculate discounted price correctly when discount > 0', () => {
    component.product = {
      productId: 'p-2',
      name: 'Discounted Item',
      shortDescription: '',
      description: '',
      categoryId: 'c-1',
      price: 100,
      discount: 20,
      brandId: null,
      colors: '',
      sizes: '',
      tags: null,
      barcode: null,
      stockQuantity: 10,
      averageRating: { value: 4.0, numRatings: 5 },
      productImages: null
    };
    fixture.detectChanges();

    expect(component.finalPrice).toBe(80);
    expect(component.hasDiscount).toBeTrue();

    const compiled = fixture.nativeElement as HTMLElement;
    const priceText = compiled.querySelector('.text-lg.font-bold')?.textContent?.trim();
    expect(priceText).toBe('$80.00');

    const strikePrice = compiled.querySelector('.line-through')?.textContent?.trim();
    expect(strikePrice).toBe('$100.00');
  });

  it('should fallback to unitPrice if price is not provided', () => {
    component.product = {
      id: 'p-3',
      name: 'Faceted Item',
      unitPrice: 25.5
    } as any;
    fixture.detectChanges();

    expect(component.originalPrice).toBe(25.5);
    expect(component.finalPrice).toBe(25.5);

    const compiled = fixture.nativeElement as HTMLElement;
    const priceText = compiled.querySelector('.text-lg.font-bold')?.textContent?.trim();
    expect(priceText).toBe('$25.50');
  });
});
