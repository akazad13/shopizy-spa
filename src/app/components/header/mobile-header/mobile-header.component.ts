import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [RouterLink, CommonModule, IconComponent],
  providers: [],
  templateUrl: './mobile-header.component.html',
  styles: ``
})
export class MobileHeaderComponent {
  selectedMobileMenu: string = 'women';
  @Input() hideMobileMenu: boolean = true;
  @Output() hideMobileMenuOutput = new EventEmitter<string>();

  updateMobileMenuSelection(option: string): void {
    this.selectedMobileMenu = option;
  }

  hideMobileDrawer(): void {
    this.hideMobileMenu = true;
    this.hideMobileMenuOutput.emit(this.hideMobileMenu ? 'close' : 'open');
  }
}
