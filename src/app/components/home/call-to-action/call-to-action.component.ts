import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  imports: [],
  templateUrl: './call-to-action.component.html',
  styles: ``
})
export class CallToActionComponent implements OnInit {
  imageUrls: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.imageUrls = [
      'https://tailwindui.com/plus/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420811/shopizy/soy4l9t0xba9dz2aq3li.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420810/shopizy/i7rpwhzj6iqthgbkfftr.jpg',
      'https://tailwindui.com/plus/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/mpjks43jpxo9eagempgu.jpg',
      'https://tailwindui.com/plus/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729437076/shopizy/rbzoctialordszafqium.jpg'
    ];
  }
}
