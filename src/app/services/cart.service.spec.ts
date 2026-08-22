import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartService } from './cart.service';
import { CartApi } from '../api/cart.api';
import { AuthService } from './auth.service';
import { ProductApi } from '../api/product.api';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    const cartApiMock = jasmine.createSpyObj('CartApi', ['getCart', 'addItem', 'updateItemQuantity', 'removeItem']);
    const productApiMock = jasmine.createSpyObj('ProductApi', ['getProductsByIds']);
    const authServiceMock = { loggedIn: () => false };

    cartApiMock.getCart.and.returnValue(of({ cartId: 'c1', userId: 'u1', createdOn: new Date(), modifiedOn: new Date(), cartItems: [] }));
    productApiMock.getProductsByIds.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: CartApi, useValue: cartApiMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ProductApi, useValue: productApiMock }
      ]
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
