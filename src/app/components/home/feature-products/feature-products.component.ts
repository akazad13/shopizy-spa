import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-feature-products',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './feature-products.component.html',
  styles: ``
})
export class FeatureProductsComponent implements OnInit {
  imageUrls: string[] = [];

  ngOnInit(): void {
    this.imageUrls = [
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/ylspgiefieiuhsua66lx.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/scbuxiqbi9kgkupt08vr.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/le9fdkqmcyomzuwemze3.jpg'
    ];
  }
}
