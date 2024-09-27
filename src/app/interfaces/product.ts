import { CustomFields } from './custom-fields';
import { Brand } from './brand';
import { ShopCategory } from './category';

export interface BaseAttributeGroup {
  name: string;
  slug: string;
  customFields?: CustomFields;
}

export type ProductAttributeGroup = BaseAttributeGroup & {
  attributes: ProductAttribute[];
};
export type ProductTypeAttributeGroup = BaseAttributeGroup & {
  attributes: string[];
};

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductOptionValueBase {
  name: string;
  slug: string;
  customFields?: CustomFields;
}

export interface ProductOptionValueColor extends ProductOptionValueBase {
  color: string;
}

export interface ProductOptionBase {
  type: string;
  name: string;
  slug: string;
  values: ProductOptionValueBase[];
  customFields?: CustomFields;
}

export type ProductStock = 'in-stock' | 'out-of-stock' | 'on-backorder';

export type ProductCompatibilityResult = 'all' | 'fit' | 'not-fit' | 'unknown';

export interface Product {
  id: number;
  name: string;
  excerpt: string;
  description: string;
  slug: string;
  sku?: string;
  stock: ProductStock;
  price: number;
  images?: string[];
  badges?: string[];
  rating?: number;
  reviews?: number;
  availability?: string;
  brand?: Brand | null;
  tags?: string[];
  categories?: ShopCategory[];
  attributes: ProductAttribute[];
  customFields?: CustomFields;
}
