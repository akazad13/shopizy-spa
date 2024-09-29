import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dropcart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dropcart.component.html',
  styles: ``
})
export class DropcartComponent {
  @Input() isDropCartOpened: boolean = false;

  closeDropCart(): void {
    this.isDropCartOpened = false;
  }
}
