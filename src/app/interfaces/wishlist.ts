import { Product } from './product';

export interface WishlistItem {
  productId: string;
  product: Product;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
}
