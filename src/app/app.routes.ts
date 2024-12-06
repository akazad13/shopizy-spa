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
        component: CheckoutComponent
      },
      {
        path: 'payment/:orderId',
        component: PaymentComponent
      },
      {
        path: 'products/:productId',
        component: ProductDetailsComponent
      },
      {
        path: 'order-confirmation/:orderId',
        component: OrderComfirmationComponent
      }
    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];
