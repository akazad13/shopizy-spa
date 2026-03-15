import { FormsModule } from '@angular/forms';
import { ClickOutsideAccountDirective } from './../../directives/click-outside-account.directive';
import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DropcartComponent } from './dropcart/dropcart.component';
import { MobileHeaderComponent } from './mobile-header/mobile-header.component';
import { IconComponent } from '../shared/icon/icon.component';
import { CategoryApi } from '../../api/category.api';
import { CategoryTree } from '../../interfaces/category';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../functions/error-handler';
import { ClickOutsideCategoryFlyoutDirective } from '../../directives/click-outside-category-flyout.directive';
import { ToIterablePipe } from '../../pipes/to-iterable.pipe';
import { CartService, CartSummary } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { AuthApi } from '../../api/auth.api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DropcartComponent,
    MobileHeaderComponent,
    IconComponent,
    ClickOutsideCategoryFlyoutDirective,
    ClickOutsideAccountDirective,
    ToIterablePipe,
    FormsModule
  ],
  providers: [CategoryApi],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {
  selected = '';
  hideMobileMenu = true;
  isDropCartOpened = false;
  isLoggedIn = false;
  categoryTree: CategoryTree[] = [];
  brands: string[] = [];
  cartSummary$!: Observable<CartSummary>;

  hideAccountMenu = true;
  accountMenu = [
    {
      label: 'Account settings',
      navigation: 'account'
    },
    {
      label: 'Order Info',
      navigation: 'account/orders'
    },
    {
      label: 'Sign out',
      navigation: 'signout'
    }
  ];

  searchTerm = '';

  constructor(
    private readonly authService: AuthService,
    public readonly cartService: CartService,
    private readonly categoryApi: CategoryApi,
    private readonly authApi: AuthApi,
    private readonly router: Router
  ) {
    this.isLoggedIn = this.authService.loggedIn();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/shop'], {
        queryParams: { search: this.searchTerm.trim() }
      });
    }
  }
  async ngOnInit(): Promise<void> {
    this.cartSummary$ = this.cartService.cartSummary$;
    try {
      this.categoryTree = await firstValueFrom(
        this.categoryApi.getcategoryTree()
      );
    } catch (error) {
      handleError(null, error);
    }

    this.brands = ['Adidas', 'Hugo Boss', 'Zara', 'Gucci', 'H&M', 'Dior'];
  }

  updateCategorySelection(option: string): void {
    if (this.selected === option) {
      this.selected = '';
    } else {
      this.selected = option;
    }
  }

  updateDropCartSelection(): void {
    this.isDropCartOpened = !this.isDropCartOpened;
  }

  showHideMobileDrawer(val: string): void {
    if (val == 'show') {
      this.hideMobileMenu = false;
    } else {
      this.hideMobileMenu = true;
    }
  }

  hideCategoryFlyout() {
    this.selected = '';
  }

  showHideAccountMenu(val: boolean) {
    this.hideAccountMenu = val;
  }

  onAccountMenuItemClick(menuItem: any) {
    if (menuItem.navigation === 'signout') {
      this.authApi.setUser(null);
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigate([menuItem.navigation]);
      this.hideAccountMenu = true;
    }
  }
}
