import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../../product/product-card/product-card.component';
import { CommonModule } from '@angular/common';

import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';

export interface BlockProducts {
  title: string;
  products: Product[];
}

@Component({
  selector: 'app-products-block',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './products-block.component.html',
  styles: ``
})
export class ProductsBlockComponent {
  @Input() column: BlockProducts | null = null;
}
