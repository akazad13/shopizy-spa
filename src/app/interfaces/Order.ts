import { Address } from './Address';
import { Price } from './Price';

export interface Order {
  id?: string;
  orderId: string;
  userId: string;
  total: Price;
  totalAmount?: number;
  subtotal?: number;
  discountAmount?: number;
  shippingCost?: number;
  taxAmount?: number;
  status?: string;
  orderStatus: string;
  shippingAddress: Address;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  promoCodeApplied?: string;
  stripePaymentIntentId?: string;
  clientSecret?: string;
  createdAtUtc?: string;
  createdOn?: Date;
}

export interface OrderDetails {
  id?: string;
  orderId: string;
  userId: string;
  deliveryCharge: Price;
  orderStatus: string;
  status?: string;
  promoCode: string;
  shippingAddress: Address;
  paymentStatus: string;
  orderItems: OrderItem[];
  items?: OrderItem[];
  totalAmount?: number;
  discountAmount?: number;
  shippingCost?: number;
  createdOn: Date;
  modifiedOn: Date;
}

export interface OrderItem {
  id?: string;
  orderItemId?: string;
  productId?: string;
  name?: string;
  productName?: string;
  unitPrice: Price | any;
  pictureUrl?: string;
  imageUrl?: string;
  quantity: number;
  discount?: number;
  lineTotal?: number;
  color?: string;
  size?: string;
}

export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipping = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6
}
