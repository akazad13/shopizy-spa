import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropcartComponent } from './dropcart/dropcart.component';
import { MobileHeaderComponent } from './mobile-header/mobile-header.component';
import { IconComponent } from '../shared/icon/icon.component';
import { CategoryApi } from '../../api/category.api';
import { CategoryTree } from '../../interfaces/category';
import { firstValueFrom } from 'rxjs';
import { handleError } from '../../functions/error-handler';
import { ClickOutsideCategoryFlyoutDirective } from '../../directives/click-outside-category-flyout.directive';
import { ToIterablePipe } from '../../pipes/to-iterable.pipe';

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
    CommonModule,
    ToIterablePipe
  ],
  providers: [CategoryApi],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {
  selected: string = '';
  hideMobileMenu: boolean = true;
  isDropCartOpened: boolean = false;
  isLoggedIn: boolean = false;
  categoriesTree: CategoryTree[] = [];
  brands: string[] = [];

  constructor(
    private readonly AuthService: AuthService,
    private readonly categoryApi: CategoryApi
  ) {
    this.isLoggedIn = this.AuthService.loggedIn();
  }
  async ngOnInit(): Promise<void> {
    try {
      this.categoriesTree = await firstValueFrom(
        this.categoryApi.getCategoriesTree()
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
}
