import { OrderStatus } from './../interfaces/Order';

export class ProductQueryFilters {
  name: string | null = null;
  categoryIds: string[] | null = null;
  averageRating: number | null = null;
  pageNumber: number = 1;
  pageSize: number = 10;
}

export class OrderQueryFilters {
  customerId: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  pageNumber: number = 1;
  pageSize: number = 10;
  status: OrderStatus | null = null;
}
