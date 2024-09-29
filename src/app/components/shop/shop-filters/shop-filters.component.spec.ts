import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFiltersComponent } from './shop-filters.component';

describe('ShopFiltersComponent', () => {
  let component: ShopFiltersComponent;
  let fixture: ComponentFixture<ShopFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
