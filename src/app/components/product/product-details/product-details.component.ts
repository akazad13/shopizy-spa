import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/product';
import { firstValueFrom } from 'rxjs';
import { ProductApi } from '../../../api/product.api';
import { handleError } from '../../../functions/error-handler';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './product-details.component.html',
  styles: ``,
  providers: [ProductApi],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productApi: ProductApi
  ) {}
  async ngOnInit(): Promise<void> {
    const productId =
      this.activatedRoute.snapshot.paramMap.get('productId') ?? '0';
    await this.getPost(productId);
  }

  private async getPost(id: string): Promise<void> {
    try {
      this.product = await firstValueFrom(this.productApi.getProduct(id));
    } catch (error) {
      handleError(null, error);
    }
  }
}
