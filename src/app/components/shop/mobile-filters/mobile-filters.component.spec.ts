import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFiltersComponent } from './mobile-filters.component';

describe('FilterDrawerComponent', () => {
  let component: MobileFiltersComponent;
  let fixture: ComponentFixture<MobileFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFiltersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
