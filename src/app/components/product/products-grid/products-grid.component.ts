import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';

import { Product } from '../../../interfaces/product';

@Component({
    selector: 'app-products-grid',
    imports: [ProductCardComponent],
    templateUrl: './products-grid.component.html',
    styles: ``
})
export class ProductsGridComponent {
  @Input() products: Product[] = [];
  constructor() {}
}
