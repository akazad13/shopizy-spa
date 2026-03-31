import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideRouter } from '@angular/router';

import { CategoryApi } from '../../api/category.api';
import { AuthApi } from '../../api/auth.api';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import {
  COMMON_TEST_IMPORTS,
  createCategoryApiSpy,
  createAuthApiSpy,
  createAuthServiceSpy,
  createCartServiceSpy,
  provideSpy
} from '../../testing/test-helpers';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    const categoryApiSpy = createCategoryApiSpy();
    const authApiSpy = createAuthApiSpy();
    const authServiceSpy = createAuthServiceSpy();
    const cartServiceSpy = createCartServiceSpy();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, ...COMMON_TEST_IMPORTS],
      providers: [
        provideRouter([]),
        provideSpy(CategoryApi, categoryApiSpy),
        provideSpy(AuthApi, authApiSpy),
        provideSpy(AuthService, authServiceSpy),
        provideSpy(CartService, cartServiceSpy)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
