import { CustomFields } from './custom-fields';
import { Brand } from './brand';
import { Category } from './category';

export interface Productspecification {
  name: string;
  value: string;
}

export interface ProductImage {
  productImageId: string;
  imageUrl: string;
}

export type ProductStock = 'in-stock' | 'out-of-stock' | 'on-backorder';

export interface Product {
  productId: number;
  name: string;
  description: string;
  categoryId?: string;
  categories?: Category[];
  price: number;
  discount?: number;
  sku?: string;
  brand?: Brand | null;
  tags?: string[];
  barcode?: string;
  slug: string;
  stock: ProductStock;
  stockQuantity?: number;
  specificationIds?: string | null;
  specifications: Productspecification[];
  productImages?: ProductImage[];
  badges?: string[];
  rating?: number;
  reviews?: number;
  customFields?: CustomFields;
}
