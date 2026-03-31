import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { OrderApi } from '../../../api/order.api';
import { TokenService } from '../../../services/token.service';
import { ToastService } from '../../../services/toast.service';
import {
  COMMON_TEST_IMPORTS,
  createOrderApiSpy,
  provideSpy
} from '../../../testing/test-helpers';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;

  beforeEach(async () => {
    const orderApiSpy = createOrderApiSpy();

    const tokenServiceStub = { getCurrentUserId: () => 'test-user' };
    const toastStub = {
      success: jasmine.createSpy('success')
    };

    await TestBed.configureTestingModule({
      imports: [OrdersComponent, ...COMMON_TEST_IMPORTS],
      providers: [
        provideSpy(OrderApi, orderApiSpy),
        { provide: TokenService, useValue: tokenServiceStub },
        { provide: ToastService, useValue: toastStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
