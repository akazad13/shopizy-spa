// --- Common & Pagination ---
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

// --- Auth Interfaces ---
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

export interface AuthResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[]; // e.g., ["Customer"], ["Admin"]
  token: string;
  refreshToken: string;
  tokenExpiresAtUtc: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

// --- Product & Faceted Search ---
export interface ProductSearchResultItem {
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
  isBogo?: boolean;
  isFreeShippingQualified?: boolean;
}

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
  items: ProductSearchResultItem[];
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

// --- Cart & Line Items ---
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantDescription?: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  color?: string;
  size?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  lastAbandonedReminderSentOn?: string;
}

// --- Shipping Rates & Tracking ---
export interface ShippingRateEstimateRequest {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  totalWeightKg: number;
  subtotal: number;
}

export interface ShippingRateEstimate {
  carrierCode: string; // e.g., "USPS", "UPS", "FedEx", "DHL"
  carrierName: string;
  serviceLevel: string; // e.g., "Ground", "2-Day Express", "Priority Overnight"
  estimatedCost: number;
  estimatedDeliveryDays: number;
  isFreeShippingQualified: boolean;
}

export interface TrackingCheckpoint {
  timestampUtc: string;
  location: string;
  status: string;
  description: string;
}

export interface ShippingTrackingInfo {
  orderId: string;
  carrierName: string;
  trackingNumber: string;
  currentStatus: 'LabelCreated' | 'InTransit' | 'OutForDelivery' | 'Delivered' | 'Failed';
  estimatedDeliveryDateUtc?: string;
  checkpoints: TrackingCheckpoint[];
}

// --- Order Management ---
export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipping'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  color?: string;
  size?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  promoCodeApplied?: string;
  stripePaymentIntentId?: string;
  clientSecret?: string; // Provided for Stripe Payment Element checkout
  createdAtUtc: string;
}

export interface CreateOrderRequest {
  shippingAddress: Address;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
    color?: string;
    size?: string;
  }[];
  promoCode?: string;
  carrierCode?: string;
  serviceLevel?: string;
  shippingCost?: number;
  loyaltyPointsRedeemed?: number;
  giftCardCode?: string;
}

// --- Promotions, Loyalty & Gift Cards ---
export interface PromoCodeResponse {
  code: string;
  discountType: 'Percentage' | 'FixedAmount' | 'BuyXGetY' | 'TieredMinimumSpend';
  discountValue: number;
  maxDiscountAmount?: number;
  minimumOrderAmount?: number;
  targetCategoryId?: string;
  isValid: boolean;
}

export interface LoyaltyAccount {
  userId: string;
  pointsBalance: number;
  tierName: string; // e.g., "Silver", "Gold", "Platinum"
  cashEquivalentValue: number;
}

export interface GiftCard {
  code: string;
  initialBalance: number;
  remainingBalance: number;
  isRedeemed: boolean;
  expiresAtUtc?: string;
}

// --- Customer Reviews ---
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

// --- Notification Preferences ---
export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  priceAlerts: boolean;
  restockAlerts: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  priceAlerts: boolean;
  restockAlerts: boolean;
}

export interface SendSmsRequest {
  phoneNumber: string;
  message: string;
}
