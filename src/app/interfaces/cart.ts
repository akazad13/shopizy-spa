export interface Cart {
  cartId: string;
  userId: string;
  createdOn: Date;
  modifiedOn: Date;
  cartItems: CartItem[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  color: string;
  size: string;
  quantity: number;
  product: {
    name: string;
    description: string;
    price: number;
    discount: number;
    brand: string;
    stockQuantity: number;
    productImages: string[];
  };
}
