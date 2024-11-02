import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { ProductQueryFilters } from '../models/ProductQueryFilters';

@Injectable()
export class ProductApi {
  baseUrl = environment.apiUrl + '/api/v1.0/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(filters: ProductQueryFilters): Observable<Product[]> {
    let params = new HttpParams();
    const { name, categoryIds, averageRating, pageNumber, pageSize } = filters;

    if (name != null) {
      params = params.append('name', name);
    }

    if (categoryIds != null) {
      for (let categoryId of categoryIds) {
        params = params.append('categoryIds', categoryId);
      }
    }

    if (averageRating != null) {
      params = params.append('averageRating', averageRating);
    }

    params = params
      .append('pageNumber', pageNumber)
      .append('pageSize', pageSize);

    return this.http.get<Product[]>(this.baseUrl, {
      params
    });
  }
}
