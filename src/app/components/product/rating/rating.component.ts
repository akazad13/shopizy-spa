import { Component, Input, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-rating',
  imports: [IconComponent, NgFor, NgIf],
  templateUrl: './rating.component.html',
  styles: ``
})
export class RatingComponent implements OnInit {
  @Input() rating: number = 5.0;
  @Input() maxRating: number = 5.0;
  @Input() classes: string = 'h-9 w-9';
  @Input() showRatingNumber: boolean = false;

  starsArray: string[] = [];

  ngOnInit(): void {
    this.calculateStars();
  }

  calculateStars(): void {
    const fullStars = Math.floor(this.rating);
    const halfStar = this.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = this.maxRating - fullStars - halfStar;

    // Fill the starsArray
    this.starsArray = [
      ...Array(fullStars).fill('full-star'),
      ...Array(halfStar).fill('half-star'),
      ...Array(emptyStars).fill('empty-star')
    ];
  }
}
