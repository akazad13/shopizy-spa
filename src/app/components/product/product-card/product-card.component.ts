import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../../services/cart.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, IconComponent, NgFor],
  providers: [],
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product | null = null;
  maxRating = 5.0;
  starsArray: string[] = [];

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    this.calculateStars();
  }

  updateCart(product: Product | null): void {
    if (product == null) return;

    this.cartService.addItem(
      new CartItem(
        product.productId,
        product.productImages?.[0].imageUrl,
        product.name,
        product.price,
        1,
        'white'
      )
    );
  }

  calculateStars(): void {
    const fullStars = Math.floor(this.product!.averageRating.value); // Number of full stars
    const halfStar = this.product!.averageRating.value % 1 >= 0.5 ? 1 : 0; // Half star if fractional part >= 0.5
    const emptyStars = this.maxRating - fullStars - halfStar; // Remaining stars are empty

    // Fill the starsArray
    this.starsArray = [
      ...Array(fullStars).fill('full-star'),
      ...Array(halfStar).fill('half-star'),
      ...Array(emptyStars).fill('empty-star')
    ];
  }
}
