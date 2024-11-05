import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../../services/cart.service';

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

  constructor(private readonly cartService: CartService) {}

  ngOnChanges(): void {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  showQuickview(): void {}

  updateCart(product: Product | null): void {
    if (product == null) return;

    this.cartService.emitData(product);
  }
}
