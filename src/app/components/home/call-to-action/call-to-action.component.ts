import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-call-to-action',
  imports: [RouterLink],
  templateUrl: './call-to-action.component.html',
  styles: ``
})
export class CallToActionComponent implements OnInit {
  imageUrls: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.imageUrls = [
      'https://res.cloudinary.com/akazad13/image/upload/v1733585800/shopizy/hero-image1_x7g7g3.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420811/shopizy/soy4l9t0xba9dz2aq3li.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420810/shopizy/i7rpwhzj6iqthgbkfftr.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1733585800/shopizy/hero-image2_cpqtlm.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729420812/shopizy/mpjks43jpxo9eagempgu.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1733585800/shopizy/hero-image3_hqxg8c.jpg',
      'https://res.cloudinary.com/akazad13/image/upload/v1729437076/shopizy/rbzoctialordszafqium.jpg'
    ];
  }
}
