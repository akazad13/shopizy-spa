import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Order } from '../interfaces/Order';
import { OrderApi } from '../api/order.api';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailResolver implements Resolve<Order> {
  constructor(
    private readonly orderApi: OrderApi,
    private readonly router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<any> {
    void _state;
    const orderId = route.paramMap.get('orderId');
    if (orderId) {
      return this.orderApi.getOrder(orderId).pipe(
        catchError((error) => {
          void error;
          this.router.navigate(['/404']);
          return of(null);
        })
      );
    }
    return of(null);
  }
}
