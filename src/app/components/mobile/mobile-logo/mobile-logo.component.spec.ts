import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLogoComponent } from './mobile-logo.component';

describe('MobileLogoComponent', () => {
  let component: MobileLogoComponent;
  let fixture: ComponentFixture<MobileLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
