import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { OrdersComponent } from './orders.component';
import { OrderApi } from '../../../api/order.api';
import { TokenService } from '../../../services/token.service';
import { AlertifyService } from '../../../services/alertify.service';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;

  beforeEach(async () => {
    const orderApiSpy = jasmine.createSpyObj('OrderApi', ['getOrders', 'cancelOrder']);
    orderApiSpy.getOrders.and.returnValue(of([]));
    orderApiSpy.cancelOrder.and.returnValue(of({ success: true }));

    const tokenServiceStub = { getCurrentUserId: () => 'test-user' };
    const alertifyStub = { confirm: jasmine.createSpy('confirm'), success: jasmine.createSpy('success') };

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: OrderApi, useValue: orderApiSpy },
        { provide: TokenService, useValue: tokenServiceStub },
        { provide: AlertifyService, useValue: alertifyStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
