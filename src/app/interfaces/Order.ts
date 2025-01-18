import { Address } from './Address';
import { Price } from './Price';

export interface Order {
  orderId: string;
  userId: string;
  total: Price;
  orderStatus: string;
  createdOn: Date;
}

export interface OrderDetails {
  orderId: string;
  userId: string;
  deliveryCharge: Price;
  orderStatus: string;
  promoCode: string;
  shippingAddress: Address;
  paymentStatus: string;
  orderItems: OrderItem[];
  createdOn: Date;
  modifiedOn: Date;
}

export interface OrderItem {
  orderItemId: string;
  name: string;
  unitPrice: Price;
  pictureUrl: string;
  quantity: number;
  discount: number;
}

export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipping = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6
}
