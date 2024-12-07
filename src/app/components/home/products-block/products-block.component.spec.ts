import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBlockComponent } from './products-block.component';

describe('ProductsBlockComponent', () => {
  let component: ProductsBlockComponent;
  let fixture: ComponentFixture<ProductsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
