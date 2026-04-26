import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Brand } from '../interfaces/brand';
import { SuccessResponse } from '../interfaces/SuccessResponse';

export interface CreateBrandRequest {
  name: string;
  logoUrl?: string;
  country?: string;
}

export interface UpdateBrandRequest {
  name?: string;
  logoUrl?: string;
  country?: string;
}

@Injectable({ providedIn: 'root' })
export class BrandApi {
  private readonly url = `${environment.apiUrl}/api/v1.0`;

  constructor(private readonly http: HttpClient) {}

  getBrands(): Observable<Brand[]> {
    return this.http.get<any>(`${this.url}/brands`).pipe(
      map((res) => {
        if (Array.isArray(res)) return res as Brand[];
        if (res?.$values && Array.isArray(res.$values))
          return res.$values as Brand[];
        if (res?.items && Array.isArray(res.items)) return res.items as Brand[];
        if (res?.items?.$values && Array.isArray(res.items.$values))
          return res.items.$values as Brand[];
        return [];
      })
    );
  }

  getBrandById(brandId: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.url}/brands/${brandId}`);
  }

  createBrand(payload: CreateBrandRequest): Observable<Brand> {
    return this.http.post<Brand>(`${this.url}/admin/brands`, payload);
  }

  updateBrand(
    brandId: string,
    payload: UpdateBrandRequest
  ): Observable<SuccessResponse> {
    return this.http.patch<SuccessResponse>(
      `${this.url}/admin/brands/${brandId}`,
      payload
    );
  }

  deleteBrand(brandId: string): Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(
      `${this.url}/admin/brands/${brandId}`
    );
  }
}
