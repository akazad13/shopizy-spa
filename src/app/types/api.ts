// ==============================================================================
// 1. Common & Base Types
// ==============================================================================

export interface ApiErrorResponse {
  title: string;
  status: number;
  detail: string;
  errors?: Record<string, string[]>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Price {
  amount: number;
  currency: string;
}

// ==============================================================================
// 2. Authentication & User Profile
// ==============================================================================

export interface AuthResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Customer' | 'Admin' | string;
  token: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isTwoFactorEnabled: boolean;
  addresses: UserAddress[];
  defaultAddressId?: string;
  createdAtUtc: string;
}

export interface UserAddress extends Address {
  id: string;
  isDefault: boolean;
}

export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  priceAlerts: boolean;
  restockAlerts: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  emailEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  priceAlerts: boolean;
  restockAlerts: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

// ==============================================================================
// 3. Products & Faceted Search
// ==============================================================================

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  stockQuantity: number;
  averageRating: number;
  totalReviews: number;
  imageUrls: string[];
  tags: string[];
  highlights?: string[];
  isBogo?: boolean;
  isFreeShippingQualified?: boolean;
}

// Backward-compatible alias for ProductItem
export type ProductSearchResultItem = ProductItem;

export interface FacetValue {
  key: string;
  label: string;
  count: number;
}

export interface SearchFacet {
  fieldName: string;
  values: FacetValue[];
}

export interface ProductSearchResult {
  items: ProductItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  facets: SearchFacet[];
  suggestedKeywords: string[];
}

export interface FacetedSearchRequest {
  searchTerm?: string;
  categoryIds?: string[];
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  minRating?: number;
  sortBy?: string;
  pageNumber: number;
  pageSize: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  priceAdjustment: number;
  stockQuantity: number;
}

// ==============================================================================
// 4. Shopping Cart
// ==============================================================================

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  color?: string;
  size?: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  variantId?: string;
  variantDescription?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  lastAbandonedReminderSentOn?: string;
}

// ==============================================================================
// 5. Shipping Methods & Fixed Tier Rates
// ==============================================================================

export interface ShippingMethod {
  carrier: string;            // e.g. "Standard", "Express", "Premium"
  serviceCode: 'STANDARD' | 'EXPRESS' | 'PREMIUM' | string;
  serviceName: string;        // e.g. "Standard Delivery", "Express Delivery", "Premium Delivery"
  rate: number;               // 4.99 | 9.99 | 19.99
  currency: string;           // "USD"
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

export enum DeliveryMethods {
  Standard = 1,
  Express = 2,
  Premium = 3
}

export interface ShippingRateEstimate {
  id?: string;
  carrierCode: string;
  carrierName: string;
  serviceCode?: string;
  serviceLevel: string;
  estimatedCost: number;
  currency?: string;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  estimatedDeliveryDays?: number;
  isFreeShippingQualified?: boolean;
}

export interface TrackingCheckpoint {
  timestampUtc: string;
  location: string;
  description: string;
  status?: string;
}

export interface ShippingTrackingInfo {
  carrier?: string;
  carrierName?: string;
  orderId?: string;
  trackingNumber: string;
  status?: 'LabelCreated' | 'InTransit' | 'OutForDelivery' | 'Delivered' | 'Failed';
  currentStatus?: 'LabelCreated' | 'InTransit' | 'OutForDelivery' | 'Delivered' | 'Failed';
  currentLocation?: string;
  estimatedDelivery?: string;
  estimatedDeliveryDateUtc?: string;
  checkpoints: TrackingCheckpoint[];
}

// ==============================================================================
// 6. Checkout & Order Management Flow
// ==============================================================================

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipping'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderItemRequest {
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

// Backward-compatible alias
export type CheckoutOrderItem = OrderItemRequest;

export interface CreateOrderRequest {
  promoCode?: string;
  giftCardCode?: string;
  deliveryMethod: DeliveryMethods | number; // 1 = Standard, 2 = Express, 3 = Premium
  deliveryCharge: Price;
  orderItems: OrderItemRequest[];
  shippingAddress: Address;
  loyaltyPointsToRedeem?: number;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variantId?: string;
  imageUrl?: string;
}

// Backward-compatible alias
export type OrderItem = OrderItemResponse;

export interface OrderResponse {
  id: string;
  userId: string;
  status: OrderStatus;
  shippingAddress: Address;
  deliveryMethod: number;
  deliveryCharge: Price;
  orderItems: OrderItemResponse[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  loyaltyPointsUsed: number;
  loyaltyPointsEarned: number;
  giftCardAmountUsed: number;
  createdAtUtc: string;
  clientSecret?: string; // Stripe Payment Element clientSecret if payment required
  shippingCost?: number;
  taxAmount?: number;
  promoCodeApplied?: string;
  stripePaymentIntentId?: string;
}

// Backward-compatible alias
export type Order = OrderResponse;

// ==============================================================================
// 7. Promotions, Loyalty & Gift Cards
// ==============================================================================

export interface ValidatePromoResponse {
  code: string;
  discountType: 'Percentage' | 'FixedAmount' | 'BuyXGetY' | 'TieredMinimumSpend';
  discountValue: number;
  maxDiscountAmount?: number;
  minimumOrderAmount?: number;
  targetCategoryId?: string;
  isValid: boolean;
}

// Backward-compatible alias
export type PromoCodeResponse = ValidatePromoResponse;

export interface LoyaltyAccountResponse {
  userId: string;
  pointsBalance: number;
  tierName: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | string;
  cashEquivalentValue: number; // 100 points = $1.00
}

// Backward-compatible alias
export type LoyaltyAccount = LoyaltyAccountResponse;

export interface GiftCardValidationResponse {
  code: string;
  balance: number;
  currency: string;
  isValid: boolean;
  expiresAtUtc?: string;
  remainingBalance?: number;
}

// Backward-compatible alias
export type GiftCard = GiftCardValidationResponse;

// ==============================================================================
// 8. Reviews, Questions & Social Proof
// ==============================================================================

export interface ProductReview {
  reviewId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  headline?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotesCount: number;
  imageUrls: string[];
  createdOn: string;
}

export interface CreateProductReviewRequest {
  rating: number;
  comment: string;
  headline?: string;
  imageUrls?: string[];
}
