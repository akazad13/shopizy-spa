import { Component } from '@angular/core';
import { PromotionComponent } from './promotion/promotion.component';
import {
  BlockProductsColumnsComponent,
  BlockProductsColumnsItem,
} from '../blocks/block-products-columns/block-products-columns.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PromotionComponent, BlockProductsColumnsComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  toProducts: BlockProductsColumnsItem = {
    title: 'Our Top Products',
    products: [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        images: [
          'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        images: [
          'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 3,
        name: 'Product 3',
        price: 50,
        images: [
          'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-04.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 4,
        name: 'Product 4',
        price: 80,
        images: [
          'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-03.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
    ],
  };

  menProducts: BlockProductsColumnsItem = {
    title: 'Men Collections',
    products: [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        images: [
          'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        images: [
          'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 3,
        name: 'Product 3',
        price: 50,
        images: [
          'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-03.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 4,
        name: 'Product 4',
        price: 80,
        images: [
          'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
    ],
  };

  womenProducts: BlockProductsColumnsItem = {
    title: 'Women Collections',
    products: [
      {
        id: 1,
        name: 'Product 1',
        price: 100,
        images: [
          'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-04.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200,
        images: [
          'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-03.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 3,
        name: 'Product 3',
        price: 50,
        images: [
          'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-01.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
      {
        id: 4,
        name: 'Product 4',
        price: 80,
        images: [
          'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-02.jpg',
        ],
        excerpt: 'Product',
        description: 'Product description',
        slug: 'product',
        stock: 'in-stock',
        attributes: [
          {
            name: 'Color',
            value: 'Black',
          },
        ],
      },
    ],
  };

  constructor() {}
}
