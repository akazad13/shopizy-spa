import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  providers: [],
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent implements OnChanges, OnInit, OnDestroy {
  @Input() product: Product | null = null;

  constructor() {}

  ngOnChanges(): void {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  showQuickview(): void {}
}
