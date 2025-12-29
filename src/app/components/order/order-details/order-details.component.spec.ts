import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderDetailsComponent } from './order-details.component';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsComponent, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            data: of({
              order: {
                orderId: '1',
                userId: '1',
                deliveryCharge: { amount: 0, currency: 'usd' },
                orderStatus: 'Pending',
                promoCode: '',
                shippingAddress: {
                  city: '',
                  country: '',
                  street: '',
                  zipCode: '',
                  state: ''
                },
                paymentStatus: 'Paid',
                orderItems: [],
                createdOn: new Date(),
                modifiedOn: new Date()
              }
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
