import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-top-categories',
    imports: [],
    templateUrl: './feature-products.component.html',
    styles: ``
})
export class FeatureProductsComponent implements OnInit {
  imageUrls: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.imageUrls = [
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/ylspgiefieiuhsua66lx.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/scbuxiqbi9kgkupt08vr.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/le9fdkqmcyomzuwemze3.jpg'
    ];
  }
}
