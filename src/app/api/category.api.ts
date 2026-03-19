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

  getCategoryById(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.url}/categories/${categoryId}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/categories`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/admin/categories`, data);
  }

  updateCategory(categoryId: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/admin/categories/${categoryId}`, data);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/admin/categories/${categoryId}`);
  }
}
