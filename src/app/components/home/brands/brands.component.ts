import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { BrandApi } from '../../../api/brand.api';
import { Brand } from '../../../interfaces/brand';
import { handleError } from '../../../functions/error-handler';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.component.html',
  styles: ``
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private readonly brandApi: BrandApi) {}

  async ngOnInit(): Promise<void> {
    try {
      this.brands = await firstValueFrom(this.brandApi.getBrands());
    } catch (error) {
      handleError(null, error);
      this.brands = [];
    }
  }
}
