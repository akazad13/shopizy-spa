import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { Product } from '../../../interfaces/product';
import { CommonModule } from '@angular/common';

export interface BlockProductsColumnsItem {
  title: string;
  products: Product[];
}

@Component({
  selector: 'app-block-products-columns',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './block-products-columns.component.html',
  styles: ``,
})
export class BlockProductsColumnsComponent {
  @Input() column!: BlockProductsColumnsItem;
  constructor() {}
}
