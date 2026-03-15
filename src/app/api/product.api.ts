import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ProductDetail } from '../interfaces/product';
import { ProductQueryFilters } from '../models/QueryFilters';

@Injectable({
  providedIn: 'root'
})
export class ProductApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) { }

  getProducts(filters: ProductQueryFilters): Observable<Product[]> {
    let params = new HttpParams();
    const {
      name,
      categoryIds,
      brandIds,
      colors,
      minPrice,
      maxPrice,
      sortBy,
      averageRating,
      pageNumber,
      pageSize
    } = filters;

    if (name != null) {
      params = params.append('name', name);
    }

    if (categoryIds != null) {
      for (const categoryId of categoryIds) {
        params = params.append('categoryIds', categoryId);
      }
    }

    if (brandIds != null) {
      for (const brandId of brandIds) {
        params = params.append('brandIds', brandId);
      }
    }

    if (colors != null) {
      for (const color of colors) {
        params = params.append('colors', color);
      }
    }

    if (minPrice != null) {
      params = params.append('minPrice', minPrice);
    }

    if (maxPrice != null) {
      params = params.append('maxPrice', maxPrice);
    }

    if (sortBy != null) {
      params = params.append('sortBy', sortBy);
    }

    if (averageRating != null) {
      params = params.append('averageRating', averageRating);
    }

    params = params
      .append('pageNumber', pageNumber)
      .append('pageSize', pageSize);

    return this.http.get<Product[]>(`${this.url}/products`, {
      params
    });
  }

  getProduct(productId: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.url}/products/${productId}`);
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
}
