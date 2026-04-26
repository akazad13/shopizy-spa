import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BrandsComponent } from './brands.component';
import { BrandApi } from '../../../api/brand.api';

describe('BrandsComponent', () => {
  let component: BrandsComponent;
  let fixture: ComponentFixture<BrandsComponent>;

  beforeEach(async () => {
    const brandApiSpy = jasmine.createSpyObj('BrandApi', ['getBrands']);
    brandApiSpy.getBrands.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [BrandsComponent],
      providers: [{ provide: BrandApi, useValue: brandApiSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
