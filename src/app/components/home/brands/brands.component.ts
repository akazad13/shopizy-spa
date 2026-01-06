import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.component.html',
  styles: ``
})
export class BrandsComponent implements OnInit {
  imageUrls: string[] = [];

  ngOnInit(): void {
    this.imageUrls = [
      'https://res.cloudinary.com/akazad13/image/upload/v1730544601/shopizy/brands/zara_o0elww.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730544601/shopizy/brands/CK_vzzc46.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730544599/shopizy/brands/adidas_as2slz.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730544600/shopizy/brands/boss-hugo-boss_hd60y1.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730544599/shopizy/brands/louis-vuitton_i7shac.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730544599/shopizy/brands/gucci_plvk2l.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730544599/shopizy/brands/h-m_mcjygs.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730544599/shopizy/brands/nike_mx9fow.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730546903/shopizy/brands/prada_md7wez.svg',
      'https://res.cloudinary.com/akazad13/image/upload/v1730547150/shopizy/brands/dior-cropped_gfjhfh.svg'
    ];
  }
}
