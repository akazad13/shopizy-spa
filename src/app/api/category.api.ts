import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CategoryTree } from './../interfaces/category';

@Injectable({ providedIn: 'root' })
export class CategoryApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) {}

  getcategoryTree(): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(`${this.url}/categories/tree`);
  }
}
