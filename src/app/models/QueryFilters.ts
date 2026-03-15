import { OrderStatus } from './../interfaces/Order';

export class ProductQueryFilters {
  name: string | null = null;
  categoryIds: string[] | null = null;
  brandIds: string[] | null = null;
  colors: string[] | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string | null = null;
  averageRating: number | null = null;
  pageNumber = 1;
  pageSize = 10;
}

export class OrderQueryFilters {
  startDate: string | null = null;
  endDate: string | null = null;
  pageNumber = 1;
  pageSize = 10;
  status: OrderStatus | null = null;
}
