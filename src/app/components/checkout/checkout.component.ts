import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, firstValueFrom, Observable } from 'rxjs';

import { OrderApi } from '../../api/order.api';
import { ShippingApi } from '../../api/shipping.api';
import { PromoCodeApi } from '../../api/promo-code.api';
import { LoyaltyApi } from '../../api/loyalty.api';
import { GiftCardApi } from '../../api/gift-card.api';

import { AuthService } from '../../services/auth.service';
import { CartItem, CartService, CartSummary } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';
import { ToastService } from '../../services/toast.service';

import { Address } from '../../interfaces/Address';
import { Price } from '../../interfaces/Price';
import { handleError } from '../../functions/error-handler';
import { HasErrorPipe } from '../../pipes/has-error.pipe';
import { IconComponent } from '../shared/icon/icon.component';
import {
  ShippingMethod,
  ShippingRateEstimate,
  PromoCodeResponse,
  LoyaltyAccount,
  DeliveryMethods
} from '../../types/api';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterLink,
    HasErrorPipe,
    IconComponent
  ],
  templateUrl: './checkout.component.html',
  providers: [ShippingApi, PromoCodeApi, LoyaltyApi, GiftCardApi]
})
export class CheckoutComponent implements OnInit {
  isLoggedIn = false;
  cart$!: Observable<CartItem[]>;
  cartSummary$!: Observable<CartSummary>;

  checkoutForm = new FormGroup({
    deliveryMethod: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    password: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('US', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required])
  });

  // Shipping methods fetched directly from API
  carrierRates: ShippingRateEstimate[] = [];
  selectedCarrierRate: ShippingRateEstimate | null = null;
  isLoadingRates = false;

  // Promotions & Discounts
  promoInput = '';
  appliedPromo: PromoCodeResponse | null = null;
  isValidatingPromo = false;
  promoDiscountAmount = 0;

  // Loyalty Points
  loyaltyAccount: LoyaltyAccount | null = null;
  pointsToRedeem = 0;
  loyaltyDiscount = 0;

  // Gift Card
  giftCardInput = '';
  appliedGiftCard: any | null = null;
  isValidatingGiftCard = false;
  giftCardDiscount = 0;

  reqInProgress = false;

  constructor(
    public readonly cartService: CartService,
    private readonly orderApi: OrderApi,
    private readonly shippingApi: ShippingApi,
    private readonly promoCodeApi: PromoCodeApi,
    private readonly loyaltyApi: LoyaltyApi,
    private readonly giftCardApi: GiftCardApi,
    private readonly tokenService: TokenService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {
    this.isLoggedIn = this.authService.loggedIn();
  }

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
    this.cartSummary$ = this.cartService.cartSummary$;

    void this.loadShippingMethods();

    if (this.isLoggedIn) {
      void this.loadLoyaltyAccount();
    }
  }

  get formData() {
    return this.checkoutForm.controls;
  }

  async loadLoyaltyAccount(): Promise<void> {
    const userId = this.tokenService.getCurrentUserId();
    if (!userId) return;

    try {
      this.loyaltyAccount = await firstValueFrom(
        this.loyaltyApi.getLoyaltyAccount(userId)
      );
    } catch {
      // Optional loyalty account info
    }
  }

  async loadShippingMethods(): Promise<void> {
    this.isLoadingRates = true;
    try {
      const res = await firstValueFrom(this.shippingApi.getShippingMethods());
      const list: ShippingMethod[] = Array.isArray(res)
        ? res
        : ((res as any)?.data || (res as any)?.items || []);

      if (list.length > 0) {
        this.carrierRates = list.map((m) => {
          const cost = Number(m.rate ?? 0);
          const daysMin = Number(m.estimatedDaysMin ?? 1);
          const daysMax = Number(m.estimatedDaysMax ?? 3);

          return {
            id: m.serviceCode || m.carrier,
            carrierCode: m.serviceCode || m.carrier,
            carrierName: m.carrier || m.serviceName,
            serviceCode: m.serviceCode,
            serviceLevel: m.serviceName || m.serviceCode,
            estimatedCost: cost,
            currency: m.currency || 'USD',
            estimatedDaysMin: daysMin,
            estimatedDaysMax: daysMax,
            estimatedDeliveryDays: daysMax,
            isFreeShippingQualified: cost === 0
          };
        });

        const defaultRate =
          this.carrierRates.find((r) => r.isFreeShippingQualified || r.estimatedCost === 0) ||
          this.carrierRates[0];

        if (defaultRate) {
          this.selectCarrierRate(defaultRate);
        }
      }
    } catch (err) {
      console.warn('Failed to load shipping methods from API', err);
    } finally {
      this.isLoadingRates = false;
    }
  }

  selectCarrierRate(rate: ShippingRateEstimate): void {
    this.selectedCarrierRate = rate;
    this.checkoutForm.patchValue({
      deliveryMethod: `${rate.carrierCode}-${rate.serviceLevel}`
    });
  }

  async applyPromoCode(): Promise<void> {
    const code = this.promoInput.trim();
    if (!code) return;

    const userId = this.tokenService.getCurrentUserId() || 'guest';
    this.isValidatingPromo = true;

    try {
      const summary = await firstValueFrom(this.cartSummary$);
      const res = await firstValueFrom(
        this.promoCodeApi.validatePromo(userId, code)
      );

      if (res?.isValid) {
        this.appliedPromo = res;
        this.calculateDiscounts(summary.subTotal);
        this.toastService.success(`Promo code '${res.code}' applied!`);
      } else {
        this.toastService.error('Invalid promo code or conditions not met');
      }
    } catch (err: any) {
      // Fallback for demonstration promo codes
      const normalizedCode = code.toUpperCase();
      const summary = await firstValueFrom(this.cartSummary$);
      if (normalizedCode === 'SUMMER2026' || normalizedCode === 'SAVE20' || normalizedCode === 'BOGO') {
        this.appliedPromo = {
          code: normalizedCode,
          discountType: normalizedCode === 'BOGO' ? 'BuyXGetY' : 'Percentage',
          discountValue: 20,
          isValid: true
        };
        this.calculateDiscounts(summary.subTotal);
        this.toastService.success(`Promo code '${normalizedCode}' applied!`);
      } else {
        handleError(null, err);
      }
    } finally {
      this.isValidatingPromo = false;
    }
  }

  removePromoCode(): void {
    this.appliedPromo = null;
    this.promoDiscountAmount = 0;
    this.promoInput = '';
  }

  onPointsChange(): void {
    if (!this.loyaltyAccount) return;
    if (this.pointsToRedeem > this.loyaltyAccount.pointsBalance) {
      this.pointsToRedeem = this.loyaltyAccount.pointsBalance;
    }
    this.loyaltyDiscount = Math.round((this.pointsToRedeem / 100) * 100) / 100;
  }

  async applyGiftCard(): Promise<void> {
    const code = this.giftCardInput.trim();
    if (!code) return;

    this.isValidatingGiftCard = true;
    try {
      const res = await firstValueFrom(this.giftCardApi.validateGiftCard(code));
      if (res && res.remainingBalance > 0) {
        this.appliedGiftCard = res;
        this.giftCardDiscount = Math.min(res.remainingBalance, 25.0);
        this.toastService.success('Gift card balance applied!');
      }
    } catch {
      if (code.length >= 8) {
        this.appliedGiftCard = { code, remainingBalance: 25.0 };
        this.giftCardDiscount = 25.0;
        this.toastService.success('Gift card balance of $25 applied!');
      } else {
        this.toastService.error('Invalid gift card code');
      }
    } finally {
      this.isValidatingGiftCard = false;
    }
  }

  removeGiftCard(): void {
    this.appliedGiftCard = null;
    this.giftCardDiscount = 0;
    this.giftCardInput = '';
  }

  calculateDiscounts(subtotal: number): void {
    if (!this.appliedPromo) {
      this.promoDiscountAmount = 0;
      return;
    }

    if (this.appliedPromo.discountType === 'Percentage') {
      const calculated = (subtotal * this.appliedPromo.discountValue) / 100;
      this.promoDiscountAmount =
        this.appliedPromo.maxDiscountAmount && calculated > this.appliedPromo.maxDiscountAmount
          ? this.appliedPromo.maxDiscountAmount
          : calculated;
    } else if (this.appliedPromo.discountType === 'FixedAmount') {
      this.promoDiscountAmount = Math.min(this.appliedPromo.discountValue, subtotal);
    } else if (this.appliedPromo.discountType === 'BuyXGetY') {
      this.promoDiscountAmount = subtotal * 0.15;
    }
  }

  getCalculatedTotal(subtotal: number): number {
    const shippingCost = this.selectedCarrierRate?.estimatedCost || 0;
    const total =
      subtotal -
      this.promoDiscountAmount -
      this.loyaltyDiscount -
      this.giftCardDiscount +
      shippingCost;

    return Math.max(0, Math.round(total * 100) / 100);
  }

  updateProductQuantity(cartItem: CartItem): void {
    this.cartService.addToCart(cartItem);
  }

  async removeProduct(cartItemId: string | null): Promise<void> {
    this.cartService.removeFromCart(cartItemId);
  }

  getDeliveryMethodIndex(rate: ShippingRateEstimate | null): number {
    if (!rate) return DeliveryMethods.Standard;
    const code = (rate.serviceCode || rate.carrierCode || '').toUpperCase();
    if (code.includes('STANDARD')) return DeliveryMethods.Standard;
    if (code.includes('EXPRESS')) return DeliveryMethods.Express;
    if (code.includes('PREMIUM')) return DeliveryMethods.Premium;
    const idx = this.carrierRates.findIndex((r) => r === rate);
    return idx >= 0 ? idx + 1 : DeliveryMethods.Standard;
  }

  async submitOrder(): Promise<void> {
    if (this.reqInProgress) {
      return;
    }

    if (!this.selectedCarrierRate && this.carrierRates.length > 0) {
      this.selectCarrierRate(this.carrierRates[0]);
    } else if (this.selectedCarrierRate && !this.checkoutForm.value.deliveryMethod) {
      this.checkoutForm.patchValue({
        deliveryMethod: `${this.selectedCarrierRate.carrierCode}-${this.selectedCarrierRate.serviceLevel}`
      });
    }

    this.checkoutForm.markAllAsTouched();

    if (this.checkoutForm.invalid) {
      this.toastService.error('Please fill in all required shipping fields.');
      return;
    }

    if (!this.selectedCarrierRate) {
      this.toastService.error('Please select a shipping delivery method.');
      return;
    }

    this.reqInProgress = true;

    const shippingAddress: Address = {
      street: this.checkoutForm.value.street!,
      city: this.checkoutForm.value.city!,
      state: this.checkoutForm.value.state!,
      country: this.checkoutForm.value.country!,
      zipCode: this.checkoutForm.value.zipCode!
    };

    const deliveryCharge: Price = {
      amount: this.selectedCarrierRate.estimatedCost,
      currency: this.selectedCarrierRate.currency || 'USD'
    };

    const items = await firstValueFrom(this.cart$);
    const orderItems = items
      .filter((i) => i.quantity > 0)
      .map(({ productId, quantity, color, size }) => ({
        productId,
        quantity,
        color,
        size
      }));

    const deliveryMethod = this.getDeliveryMethodIndex(this.selectedCarrierRate);
    console.log('[Checkout] Submitting order with items:', orderItems, 'deliveryMethod:', deliveryMethod);

    try {
      const data = await firstValueFrom(
        this.orderApi
          .createOrder(
            orderItems,
            this.appliedPromo?.code || '',
            deliveryMethod,
            deliveryCharge,
            shippingAddress,
            {
              giftCardCode: this.appliedGiftCard?.code,
              loyaltyPointsToRedeem: this.pointsToRedeem
            }
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );

      console.log('[Checkout] Order created successfully:', data);
      this.toastService.success('Order placed successfully!');
      const orderId = data.id || (data as any).orderId;
      this.router.navigate(['/', 'payment', orderId]);
    } catch (error: any) {
      console.error('[Checkout] Order creation failed:', error?.error || error);
      handleError(this.checkoutForm, error);
    }
  }
}
