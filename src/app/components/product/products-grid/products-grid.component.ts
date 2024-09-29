import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../../interfaces/product';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './products-grid.component.html',
  styles: ``,
})
export class ProductsGridComponent {
  @Input() products: Product[] = [];
  constructor() {}
}
