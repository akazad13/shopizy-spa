import { Address } from './Address';
import { Price } from './Price';

export interface Order {
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
  pictureUrl: string;
  quantity: number;
  discount: number;
}
