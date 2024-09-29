import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropcartComponent } from './dropcart/dropcart.component';
import { MobileHeaderComponent } from './mobile-header/mobile-header.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, DropcartComponent, MobileHeaderComponent],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  selected: string = '';
  hideMobileMenu: boolean = true;
  isDropCartOpened: boolean = false;

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
