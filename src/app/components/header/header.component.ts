import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropcartComponent } from './dropcart/dropcart.component';
import { MobileHeaderComponent } from './mobile-header/mobile-header.component';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DropcartComponent,
    MobileHeaderComponent,
    IconComponent
  ],
  providers: [],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  selected: string = '';
  hideMobileMenu: boolean = true;
  isDropCartOpened: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private readonly AuthService: AuthService) {
    this.isLoggedIn = this.AuthService.loggedIn();
  }

  updateSelection(option: string): void {
    this.selected = option;
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
}
