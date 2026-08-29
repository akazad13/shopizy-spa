import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderApi } from '../../api/order.api';
import { ShippingApi } from '../../api/shipping.api';
import { PromoCodeApi } from '../../api/promo-code.api';
import { LoyaltyApi } from '../../api/loyalty.api';
import { GiftCardApi } from '../../api/gift-card.api';
import { ToastService } from '../../services/toast.service';
import { TokenService } from '../../services/token.service';
import { DeliveryMethods, ShippingRateEstimate } from '../../types/api';
import {
  COMMON_TEST_IMPORTS,
  createOrderApiSpy,
  provideSpy
} from '../../testing/test-helpers';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    const cartServiceStub = {
      getCart: () => of([]),
      cartSummary$: of({ subTotal: 100, saving: 0, total: 100, totalItems: 1 })
    } as Partial<CartService>;

    const authServiceStub = { loggedIn: () => true } as Partial<AuthService>;

    const orderApiSpy = createOrderApiSpy();

    const shippingApiStub = {
      getShippingMethods: () => of([
        {
          carrier: 'Standard',
          serviceCode: 'STANDARD',
          serviceName: 'Standard Delivery',
          rate: 4.99,
          currency: 'USD',
          estimatedDaysMin: 3,
          estimatedDaysMax: 5
        },
        {
          carrier: 'Express',
          serviceCode: 'EXPRESS',
          serviceName: 'Express Delivery',
          rate: 9.99,
          currency: 'USD',
          estimatedDaysMin: 2,
          estimatedDaysMax: 3
        },
        {
          carrier: 'Premium',
          serviceCode: 'PREMIUM',
          serviceName: 'Premium Delivery',
          rate: 19.99,
          currency: 'USD',
          estimatedDaysMin: 1,
          estimatedDaysMax: 2
        }
      ])
    };

    const promoCodeApiStub = {
      validatePromo: () => of({
        code: 'SUMMER20',
        discountType: 'Percentage',
        discountValue: 20,
        isValid: true
      })
    };

    const loyaltyApiStub = {
      getLoyaltyAccount: () => of({
        userId: 'user-1',
        pointsBalance: 500,
        tierName: 'Gold',
        cashEquivalentValue: 5.0
      })
    };

    const giftCardApiStub = {
      validateGiftCard: () => of({
        code: 'GC-1234',
        balance: 25.0,
        currency: 'USD',
        isValid: true
      })
    };

    const tokenServiceStub = {
      getCurrentUserId: () => 'user-1',
      getToken: () => 'valid-jwt'
    };

    const toastStub = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info')
    } as Partial<ToastService>;

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, RouterTestingModule, ...COMMON_TEST_IMPORTS],
      providers: [
        { provide: CartService, useValue: cartServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: ShippingApi, useValue: shippingApiStub },
        { provide: PromoCodeApi, useValue: promoCodeApiStub },
        { provide: LoyaltyApi, useValue: loyaltyApiStub },
        { provide: GiftCardApi, useValue: giftCardApiStub },
        { provide: TokenService, useValue: tokenServiceStub },
        provideSpy(OrderApi, orderApiSpy),
        { provide: ToastService, useValue: toastStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map DeliveryMethods enum correctly (1: Standard, 2: Express, 3: Premium)', () => {
    const standardRate: ShippingRateEstimate = {
      carrierCode: 'Standard',
      carrierName: 'Standard',
      serviceCode: 'STANDARD',
      serviceLevel: 'Standard Delivery',
      estimatedCost: 4.99
    };
    const expressRate: ShippingRateEstimate = {
      carrierCode: 'Express',
      carrierName: 'Express',
      serviceCode: 'EXPRESS',
      serviceLevel: 'Express Delivery',
      estimatedCost: 9.99
    };
    const premiumRate: ShippingRateEstimate = {
      carrierCode: 'Premium',
      carrierName: 'Premium',
      serviceCode: 'PREMIUM',
      serviceLevel: 'Premium Delivery',
      estimatedCost: 19.99
    };

    expect(component.getDeliveryMethodIndex(standardRate)).toBe(DeliveryMethods.Standard);
    expect(component.getDeliveryMethodIndex(expressRate)).toBe(DeliveryMethods.Express);
    expect(component.getDeliveryMethodIndex(premiumRate)).toBe(DeliveryMethods.Premium);
  });

  it('should calculate promo code percentage discount properly', () => {
    component.appliedPromo = {
      code: 'SAVE20',
      discountType: 'Percentage',
      discountValue: 20,
      isValid: true
    };

    component.calculateDiscounts(100);
    expect(component.promoDiscountAmount).toBe(20);
  });

  it('should compute loyalty discount (100 points = $1.00)', () => {
    component.loyaltyAccount = {
      userId: 'user-1',
      pointsBalance: 500,
      tierName: 'Gold',
      cashEquivalentValue: 5.0
    };

    component.pointsToRedeem = 300;
    component.onPointsChange();
    expect(component.loyaltyDiscount).toBe(3.0);
  });
});
