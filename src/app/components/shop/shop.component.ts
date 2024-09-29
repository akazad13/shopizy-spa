import { BlockProductsComponent } from '../blocks/block-products/block-products.component';
import { Product } from '../../interfaces/product';
import { Component } from '@angular/core';
import { ProductsGridComponent } from '../product/products-grid/products-grid.component';
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MobileFiltersComponent } from './mobile-filters/mobile-filters.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    BlockProductsComponent,
    ProductsGridComponent,
    MobileFiltersComponent,
    ShopFiltersComponent,
    CommonModule
  ],
  templateUrl: './shop.component.html',
  styles: ``
})
export class ShopComponent {
  hideMobileFilters: boolean = true;
  hideSortingOptions: boolean = true;

  products: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      images: [
        'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200,
      images: [
        'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    },
    {
      id: 3,
      name: 'Product 3',
      price: 50,
      images: [
        'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-04.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    },
    {
      id: 4,
      name: 'Product 4',
      price: 80,
      images: [
        'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-03.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    },
    {
      id: 5,
      name: 'Product 1',
      price: 100,
      images: [
        'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    },
    {
      id: 6,
      name: 'Product 2',
      price: 200,
      images: [
        'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    },
    {
      id: 7,
      name: 'Product 3',
      price: 50,
      images: [
        'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-04.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    },
    {
      id: 8,
      name: 'Product 4',
      price: 80,
      images: [
        'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-03.jpg'
      ],
      excerpt: 'Product',
      description: 'Product description',
      slug: 'product',
      stock: 'in-stock',
      attributes: [
        {
          name: 'Color',
          value: 'Black'
        }
      ]
    }
  ];

  showHideMobileFiltersDrawer(val: string): void {
    if (val == 'show') {
      this.hideMobileFilters = false;
    } else {
      this.hideMobileFilters = true;
    }
  }

  showHideSortingOptions(): void {
    this.hideSortingOptions = !this.hideSortingOptions;
  }
}
