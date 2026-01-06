import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductApi } from '../../api/product.api';

import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';

import {
  COMMON_TEST_IMPORTS,
  createProductApiSpy,
  provideSpy
} from '../../testing/test-helpers';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    const productApiSpy = createProductApiSpy();

    await TestBed.configureTestingModule({
      imports: [HomeComponent, ...COMMON_TEST_IMPORTS],
      providers: [provideRouter([]), provideSpy(ProductApi, productApiSpy)]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
