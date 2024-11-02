export class ProductQueryFilters {
  name: string | null = null;
  categoryIds: string[] | null = null;
  averageRating: number | null = null;
  pageNumber: number = 1;
  pageSize: number = 10;
}
