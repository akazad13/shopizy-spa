import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

import { Product } from '../../../interfaces/product';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, IconComponent],
  templateUrl: './products-grid.component.html',
  styles: ``
})
export class ProductsGridComponent {
  @Input() products: Product[] = [];
}
