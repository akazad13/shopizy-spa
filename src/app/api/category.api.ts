import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CategoryTree } from './../interfaces/category';

@Injectable({ providedIn: 'root' })
export class CategoryApi {
  baseUrl = environment.apiUrl + '/api/v1.0/categories';

  constructor(private readonly http: HttpClient) {}

  getcategoryTree(): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(this.baseUrl + '/tree');
  }
}
