import { Product } from './product';

export interface WishlistItem {
  wishlistItemId?: string;
  productId: string;
  product?: Product;
}

export interface Wishlist {
  wishlistId?: string;
  userId: string;
  createdOn?: string;
  modifiedOn?: string | null;
  wishlistItems: WishlistItem[];
}
