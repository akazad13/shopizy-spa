import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../../product/product-card/product-card.component';
import { Product } from '../../../interfaces/product';
import { CommonModule } from '@angular/common';

export interface BlockProducts {
  title: string;
  products: Product[];
}

@Component({
  selector: 'app-block-products',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './block-products.component.html',
  styles: ``,
})
export class BlockProductsComponent {
  @Input() column!: BlockProducts;
  constructor() {}
}
