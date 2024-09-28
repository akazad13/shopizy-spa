import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropcartComponent } from '../dropcart/dropcart.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, DropcartComponent],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  selected: string = '';
  hideMobileMenu: boolean = false;
  selectedMobileMenu: string = 'women';
  isDropCartOpened: boolean = false;

  updateSelection(option: string): void {
    this.selected = option;
  }

  hideDrawer(val: boolean): void {
    this.hideMobileMenu = val;
  }

  updateMobileMenuSelection(option: string): void {
    this.selectedMobileMenu = option;
  }

  updateDropCartSelection(): void {
    this.isDropCartOpened = !this.isDropCartOpened;
  }
}
