import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CategoryTree } from '../../../interfaces/category';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [RouterLink, CommonModule, IconComponent],
  providers: [],
  templateUrl: './mobile-header.component.html',
  styles: ``
})
export class MobileHeaderComponent {
  selectedMobileMenu = 'Women';
  @Input() hideMobileMenu = true;
  @Input() categoryTree: CategoryTree[] = [];
  @Input() brands: string[] = [];
  @Output() hideMobileMenuOutput = new EventEmitter<string>();

  updateMobileMenuSelection(option: string): void {
    this.selectedMobileMenu = option;
  }

  hideMobileDrawer(): void {
    this.hideMobileMenu = true;
    this.hideMobileMenuOutput.emit(this.hideMobileMenu ? 'close' : 'open');
  }
}
