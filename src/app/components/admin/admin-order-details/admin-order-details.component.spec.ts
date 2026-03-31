import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderDetailsComponent } from './admin-order-details.component';
import { provideRouter } from '@angular/router';
import { OrderApi } from '../../../api/order.api';
import { ToastService } from '../../../services/toast.service';
import { of } from 'rxjs';

describe('AdminOrderDetailsComponent', () => {
  let component: AdminOrderDetailsComponent;
  let fixture: ComponentFixture<AdminOrderDetailsComponent>;

  beforeEach(async () => {
    const orderApiMock = jasmine.createSpyObj('OrderApi', ['getGlobalOrder', 'updateOrderStatus']);
    const toastServiceMock = jasmine.createSpyObj('ToastService', ['success', 'error']);

    orderApiMock.getGlobalOrder.and.returnValue(of({ orderStatus: 1 }));

    await TestBed.configureTestingModule({
      imports: [AdminOrderDetailsComponent],
      providers: [
        { provide: OrderApi, useValue: orderApiMock },
        { provide: ToastService, useValue: toastServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
