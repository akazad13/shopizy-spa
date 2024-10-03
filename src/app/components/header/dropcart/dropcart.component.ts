import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-dropcart',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dropcart.component.html',
  styles: ``
})
export class DropcartComponent {
  @Input() isDropCartOpened: boolean = false;

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }
}
