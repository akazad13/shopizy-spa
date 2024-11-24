export interface Cart {
  cartId: string;
  userId: string;
  createdOn: Date;
  modifiedOn: Date;
  lineItems: CartLineItem[];
}

export interface CartLineItem {
  lineItemId: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    description: string;
    price: string;
    discount: number;
    brand: string;
    stockQuantity: number;
    productImages: string[];
  };
}

export interface Price {
  amount: number;
  currency: string;
}
