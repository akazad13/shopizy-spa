import { CustomFields } from './custom-fields';

export interface Productspecification {
  name: string;
  value: string;
}

export interface ProductImage {
  productImageId: string;
  imageUrl: string;
}

export interface Product {
  productId: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: number;
  discount: number;
  brandId: string | null;
  colors: string;
  sizes: string;
  tags: string | null;
  barcode: string | null;
  stockQuantity: number;
  averageRating: AverageRating;
  productImages: ProductImage[] | null;
  customFields?: CustomFields;
}

export interface ProductDetail extends Product {
  sku: string | null;
  favourites: number;
  specifications: Productspecification[] | null;
  productReviews: ProductReview[];
}

export interface AverageRating {
  value: number;
  numRatings: number;
}

export interface ProductReview {
  productReviewId: string;
  reviewer: string;
  reviewerImageUrl: string | null;
  comment: string;
  rating: number;
  createdOn: Date;
}

export interface AdminProductCreateUpdate {
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  brandId: string | null;
  sku: string;
  price: number;
  unitPrice: number;
  discount: number;
  stockQuantity: number;
  colors: string;
  sizes: string;
  tags: string;
  images: string[];
}

export interface PaginatedResponse<T> {
  items: T;
  totalCount?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
  $values?: T; // For JSON.NET reference loop handling
}
