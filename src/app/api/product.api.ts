import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Product,
  ProductDetail,
  AdminProductCreateUpdate
} from '../interfaces/product';
import { ProductQueryFilters } from '../models/QueryFilters';

@Injectable({
  providedIn: 'root'
})
export class ProductApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) {}

  getProducts(filters: ProductQueryFilters): Observable<any> {
    let params = new HttpParams();
    const {
      name,
      categoryIds,
      productIds,
      inStockOnly,
      brandIds,
      minPrice,
      maxPrice,
      sortBy,
      averageRating,
      pageNumber,
      pageSize
    } = filters;

    if (name != null) {
      params = params.append('Name', name);
    }

    if (categoryIds != null) {
      for (const categoryId of categoryIds) {
        params = params.append('CategoryIds', categoryId);
      }
    }

    if (productIds != null) {
      for (const productId of productIds) {
        params = params.append('ProductIds', productId);
      }
    }

    if (inStockOnly != null) {
      params = params.append('InStockOnly', inStockOnly.toString());
    }

    if (brandIds != null) {
      for (const brandId of brandIds) {
        params = params.append('brandIds', brandId);
      }
    }

    if (minPrice != null) {
      params = params.append('MinPrice', minPrice.toString());
    }

    if (maxPrice != null) {
      params = params.append('MaxPrice', maxPrice.toString());
    }

    if (sortBy != null) {
      params = params.append('SortBy', sortBy);
    }

    if (averageRating != null) {
      params = params.append('AverageRating', averageRating.toString());
    }

    params = params
      .append('PageNumber', pageNumber.toString())
      .append('PageSize', pageSize.toString());

    return this.http
      .get<any>(`${this.url}/products`, {
        params
      })
      .pipe(
        map((res) => {
          // If it's a straight array, wrap it
          if (Array.isArray(res))
            return { items: res, totalCount: res.length, totalPages: 1 };

          // Handle $values or items wrapper
          let items: Product[] = [];
          if (res?.$values && Array.isArray(res.$values)) {
            items = res.$values;
          } else if (res?.items && Array.isArray(res.items)) {
            items = res.items;
          } else if (res?.items?.$values && Array.isArray(res.items.$values)) {
            items = res.items.$values;
          } else {
            items = [];
          }

          return {
            items,
            totalCount: res?.totalCount || res?.totalItems || items.length,
            totalPages: res?.totalPages || 1,
            currentPage: res?.pageNumber || res?.currentPage || pageNumber
          };
        })
      );
  }

  getProduct(productId: string): Observable<ProductDetail> {
    return this.http.get<any>(`${this.url}/products/${productId}`).pipe(
      map((product) => {
        if (product) {
          if (product.productImages && product.productImages.$values)
            product.productImages = product.productImages.$values;
          if (product.specifications && product.specifications.$values)
            product.specifications = product.specifications.$values;
          if (product.productReviews && product.productReviews.$values)
            product.productReviews = product.productReviews.$values;
        }
        return product as ProductDetail;
      })
    );
  }

  getProductsByIds(productIds: string[]): Observable<Product[]> {
    let params = new HttpParams();
    for (const id of productIds) {
      params = params.append('ProductIds', id);
    }
    return this.http.get<any>(`${this.url}/products`, { params }).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res && res.$values && Array.isArray(res.$values))
          return res.$values;
        if (res && res.items && Array.isArray(res.items)) return res.items;
        return [];
      })
    );
  }

  submitReview(
    productId: string,
    rating: number,
    comment: string
  ): Observable<any> {
    return this.http.post<any>(`${this.url}/products/${productId}/reviews`, {
      rating,
      comment
    });
  }

  // --- ADMIN ENDPOINTS ---

  createProduct(data: AdminProductCreateUpdate): Observable<ProductDetail> {
    return this.http.post<ProductDetail>(`${this.url}/admin/products`, data);
  }

  updateProduct(
    productId: string,
    data: AdminProductCreateUpdate
  ): Observable<ProductDetail> {
    return this.http.put<ProductDetail>(
      `${this.url}/admin/products/${productId}`,
      data
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/admin/products/${productId}`);
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/brands`);
  }

  addProductImage(productId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      `${this.url}/admin/products/${productId}/image`,
      formData
    );
  }

  deleteProductImage(productId: string, imageId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/admin/products/${productId}/image/${imageId}`
    );
  }

  // --- VARIANTS ---

  getVariants(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/products/${productId}/variants`);
  }

  addVariant(productId: string, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/admin/products/${productId}/variants`,
      data
    );
  }

  updateVariant(
    productId: string,
    variantId: string,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.url}/admin/products/${productId}/variants/${variantId}`,
      data
    );
  }

  removeVariant(productId: string, variantId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/admin/products/${productId}/variants/${variantId}`
    );
  }

  // --- BULK OPERATIONS ---

  bulkDelete(productIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.url}/admin/products/bulk-delete`, {
      productIds
    });
  }

  bulkUpdateStatus(productIds: string[], isActive: boolean): Observable<any> {
    return this.http.patch<any>(
      `${this.url}/admin/products/bulk-update-status`,
      { productIds, isActive }
    );
  }

  // --- REVIEWS ---

  getProductReviews(
    productId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http
      .get<any[]>(`${this.url}/products/${productId}/reviews`, { params })
      .pipe(
        map((res) => {
          if (Array.isArray(res)) return res;
          if (res && (res as any).$values) return (res as any).$values;
          if (res && (res as any).items) return (res as any).items;
          return res;
        })
      );
  }

  deleteReview(productId: string, reviewId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/admin/products/${productId}/reviews/${reviewId}`
    );
  }
}
