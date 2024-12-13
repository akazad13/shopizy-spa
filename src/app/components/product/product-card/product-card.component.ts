import { Component, Input } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, RatingComponent],
  providers: [],
  templateUrl: './product-card.component.html',
  styles: ``
})
export class ProductCardComponent {
  @Input() product!: Product;
  maxRating = 5.0;
  starsArray: string[] = [];

  constructor() {}
}
