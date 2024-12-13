import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { ProductApi } from '../api/product.api';
import { ProductDetail } from '../interfaces/product';
import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailResolver implements Resolve<ProductDetail> {
  constructor(
    private readonly productApi: ProductApi,
    private readonly router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const productId = route.paramMap.get('productId');
    if (productId) {
      return this.productApi.getProduct(productId).pipe(
        catchError((error) => {
          this.router.navigate(['/404']);
          return of(null);
        })
      );
    }
    return of(null);
  }
}
