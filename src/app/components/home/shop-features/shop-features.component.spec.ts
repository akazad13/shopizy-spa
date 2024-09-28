import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFeaturesComponent } from './shop-features.component';

describe('ShopFeaturesComponent', () => {
  let component: ShopFeaturesComponent;
  let fixture: ComponentFixture<ShopFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
