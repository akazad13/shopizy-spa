import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';

@Injectable()
export class ProductApi {
  baseUrl = environment.apiUrl + '/api/v1.0/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(type: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
}
