import { Component, Input } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../../services/cart.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, IconComponent],
  providers: [],
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent {
  @Input() product: Product | null = null;

  constructor(private readonly cartService: CartService) {}

  updateCart(product: Product | null): void {
    if (product == null) return;

    this.cartService.addItem(
      new CartItem(
        product.productId,
        product.productImages?.[0].imageUrl,
        product.name,
        product.price,
        1,
        product?.specifications?.[0]?.value
      )
    );
  }
}
