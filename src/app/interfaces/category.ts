import { CustomFields } from './custom-fields';

export interface Category {
  id: number;
  type: string;
  name: string;
  slug: string;
  image: string | null;
  items?: number;
  parent?: this;
  children?: this[];
  customFields: CustomFields;
}

export interface CategoryTree {
  id: string;
  name: string;
  parentId: string;
  children?: CategoryTree[];
  expanded?: boolean;
}
