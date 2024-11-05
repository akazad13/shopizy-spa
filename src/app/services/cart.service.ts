import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly addProductSubject: Subject<Product> = new Subject<Product>();
  addProductSubjectData$ = this.addProductSubject.asObservable();

  constructor() {}

  emitData(data: Product) {
    this.addProductSubject.next(data);
  }
}

export class CartItem {
  constructor(
    productId: string,
    image: string | undefined,
    name: string,
    price: number,
    quantity: number,
    color: string | null
  ) {
    this.productId = productId;
    this.image = image;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.color = color; // Add color property here for each item. For example, 'Red', 'Blue', 'Green', etc.
  }
  productId: string;
  image: string | undefined;
  name: string;
  price: number;
  quantity: number;
  color: string | null;
}
