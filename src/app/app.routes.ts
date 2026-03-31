import { Routes } from '@angular/router';
import { ShopComponent } from './components/shop/shop.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { RootComponent } from './components/root/root.component';
import { PageNotFoundComponent } from './components/site/page-not-found/page-not-found.component';
import { PageFaqComponent } from './components/site/page-faq/page-faq.component';
import { PageAboutUsComponent } from './components/site/page-about-us/page-about-us.component';
import { PageContactUsComponent } from './components/site/page-contact-us/page-contact-us.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OrderComfirmationComponent } from './components/order/order-comfirmation/order-comfirmation.component';
import { ProductDetailResolver } from './resolvers/product-details.resolver';
import { OrderDetailResolver } from './resolvers/order-details.resolver';
import { AccountComponent } from './components/account/account.component';
import { OrdersComponent } from './components/account/orders/orders.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      },
      {
        path: 'shop',
        component: ShopComponent
      },
      {
        path: 'contact-us',
        component: PageContactUsComponent
      },
      {
        path: 'about-us',
        component: PageAboutUsComponent
      },
      {
        path: 'faq',
        component: PageFaqComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payment/:orderId',
        component: PaymentComponent,
        canActivate: [AuthGuard],
        resolve: { order: OrderDetailResolver }
      },
      {
        path: 'product/:productId',
        component: ProductDetailsComponent,
        resolve: { product: ProductDetailResolver }
      },
      {
        path: 'order-confirmation/:orderId',
        component: OrderComfirmationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'account/orders',
        component: OrdersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'orders/:orderId',
        component: OrderDetailsComponent,
        canActivate: [AuthGuard],
        resolve: { order: OrderDetailResolver }
      },
      {
        path: 'wishlist',
        component: WishlistComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'auth',
    children: [
      { 
        path: 'signin', 
        component: SigninComponent,
        canActivate: [AuthGuard],
        data: { authGuardMode: 'redirectToDashboard' }
      },
      { 
        path: 'signup', 
        component: SignupComponent,
        canActivate: [AuthGuard],
        data: { authGuardMode: 'redirectToDashboard' }
      }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin.routes').then((m) => m.adminRoutes)
  },
  { path: '**', component: PageNotFoundComponent }
];
