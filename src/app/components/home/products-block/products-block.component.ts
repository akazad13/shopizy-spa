import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../../product/product-card/product-card.component';
import { CommonModule } from '@angular/common';

import { Product } from '../../../interfaces/product';

export interface BlockProducts {
  title: string;
  products: Product[];
}

@Component({
  selector: 'app-products-block',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products-block.component.html',
  styles: ``
})
export class ProductsBlockComponent {
  @Input() column: BlockProducts | null = null;
  constructor() {}
}
