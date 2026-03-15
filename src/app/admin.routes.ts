import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminOrderDetailsComponent } from './components/admin/admin-order-details/admin-order-details.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminProductFormComponent } from './components/admin/admin-product-form/admin-product-form.component';
import { AuthGuard } from './guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'products',
        component: AdminProductsComponent
      },
      {
        path: 'products/new',
        component: AdminProductFormComponent
      },
      {
        path: 'products/:id',
        component: AdminProductFormComponent
      },
      {
        path: 'orders',
        component: AdminOrdersComponent
      },
      {
        path: 'orders/:id',
        component: AdminOrderDetailsComponent
      },
      {
        path: 'users',
        component: AdminUsersComponent
      }
    ]
  }
];
