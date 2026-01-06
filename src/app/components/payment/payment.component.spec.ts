import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NgxStripeModule } from 'ngx-stripe';
import { PaymentApi } from '../../api/payment.api';
import { PaymentComponent } from './payment.component';
import {
  COMMON_TEST_IMPORTS,
  createPaymentApiSpy,
  provideSpy
} from '../../testing/test-helpers';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    const paymentApiSpy = createPaymentApiSpy();

    await TestBed.configureTestingModule({
      imports: [
        PaymentComponent,
        NgxStripeModule.forRoot('pk_test'),
        ...COMMON_TEST_IMPORTS
      ],
      providers: [
        provideSpy(PaymentApi, paymentApiSpy),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            data: of({ order: null })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
