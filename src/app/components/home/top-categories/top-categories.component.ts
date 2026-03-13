import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-categories',
  templateUrl: './top-categories.component.html',
  imports: [RouterLink],
  styles: ``
})
export class TopCategoriesComponent {
  categories = [
    { name: 'T-Shirts', image: 'https://res.cloudinary.com/akazad13/image/upload/v1729420811/shopizy/soy4l9t0xba9dz2aq3li.jpg' },
    { name: 'Jeans', image: 'https://res.cloudinary.com/akazad13/image/upload/v1729420811/shopizy/soy4l9t0xba9dz2aq3li.jpg' },
    { name: 'Jackets', image: 'https://res.cloudinary.com/akazad13/image/upload/v1729420811/shopizy/soy4l9t0xba9dz2aq3li.jpg' },
    { name: 'Accessories', image: 'https://res.cloudinary.com/akazad13/image/upload/v1729420811/shopizy/soy4l9t0xba9dz2aq3li.jpg' }
  ];
}
