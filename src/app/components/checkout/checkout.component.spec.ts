import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderApi } from '../../api/order.api';
import { AlertifyService } from '../../services/alertify.service';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    const cartServiceStub = {
      getCart: () => of([]),
      cartSummary: { subTotal: 0, saving: 0, total: 0, totalItems: 0 }
    } as Partial<CartService>;

    const authServiceStub = { loggedIn: () => false } as Partial<AuthService>;

    const orderApiSpy = jasmine.createSpyObj('OrderApi', ['createOrder']);
    orderApiSpy.createOrder.and.returnValue(of({ orderId: '1' }));

    const alertifyStub = { success: jasmine.createSpy('success') } as Partial<AlertifyService>;

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: OrderApi, useValue: orderApiSpy },
        { provide: AlertifyService, useValue: alertifyStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
