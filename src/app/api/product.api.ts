import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../interfaces/product';

@Injectable()
export class ProductApi {
  baseUrl = environment.apiUrl + '/api/v1.0/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(
    name: string | null,
    categoryIds: string[] | null,
    averageRating: number | null
  ): Observable<Product[]> {
    let params = new HttpParams();
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

    return this.http.get<Product[]>(this.baseUrl, {
      params
    });
  }
}
