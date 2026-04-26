import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

/** Common modules to include in TestBed imports */
export const COMMON_TEST_IMPORTS = [
  HttpClientTestingModule,
  RouterTestingModule
];

/** Generic helper to build a provider that uses a jasmine spy object */
export function provideSpy(token: any, spy: any) {
  return { provide: token, useValue: spy } as const;
}

/** API spy factories with sane default return values to avoid network calls */
export function createProductApiSpy() {
  const s = jasmine.createSpyObj('ProductApi', ['getProducts', 'getProduct']);
  s.getProducts.and.returnValue(of([]));
  s.getProduct.and.returnValue(of(null));
  return s;
}

export function createCategoryApiSpy() {
  const s = jasmine.createSpyObj('CategoryApi', ['getCategories', 'getCategoryTree']);
  s.getCategories.and.returnValue(of([]));
  s.getCategoryTree.and.returnValue(of([]));
  return s;
}

export function createBrandApiSpy() {
  const s = jasmine.createSpyObj('BrandApi', ['getBrands']);
  s.getBrands.and.returnValue(of([]));
  return s;
}

export function createAuthApiSpy() {
  const s = jasmine.createSpyObj('AuthApi', ['signin', 'signup', 'setUser']);
  s.user$ = of(null);
  s.signin.and.returnValue(of({}));
  s.signup.and.returnValue(of({}));
  if (s.setUser && s.setUser.and) {
    s.setUser.and.returnValue(null);
  }
  return s;
}

export function createAuthServiceSpy() {
  const s = jasmine.createSpyObj('AuthService', ['roleMatch', 'getCurrentUserToken']);
  s.roleMatch.and.returnValue(false);
  return s;
}

export function createCartServiceSpy() {
  const s = jasmine.createSpyObj('CartService', ['addToCart', 'removeFromCart', 'clearCart']);
  s.cartSummary$ = of({ totalItems: 0, totalPrice: 0 });
  return s;
}

export function createUserApiSpy() {
  const s = jasmine.createSpyObj('UserApi', ['getUser', 'updateUser']);
  s.getUser.and.returnValue(of(null));
  s.updateUser.and.returnValue(of({}));
  return s;
}

export function createOrderApiSpy() {
  const s = jasmine.createSpyObj('OrderApi', [
    'getOrders',
    'createOrder',
    'cancelOrder',
    'getOrder'
  ]);
  s.getOrders.and.returnValue(of([]));
  s.getOrder.and.returnValue(of(null));
  s.createOrder.and.returnValue(of({}));
  s.cancelOrder.and.returnValue(of({}));
  return s;
}

export function createPaymentApiSpy() {
  const s = jasmine.createSpyObj('PaymentApi', ['postPayment']);
  s.postPayment.and.returnValue(of({}));
  return s;
}

/** Simple CartService stub */
export function createCartServiceStub() {
  return {
    addToCart: jasmine.createSpy('addToCart'),
    removeFromCart: jasmine.createSpy('removeFromCart')
  };
}
