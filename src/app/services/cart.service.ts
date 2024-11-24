import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly addProductSubject: Subject<CartItem> =
    new Subject<CartItem>();
  private readonly removeProductSubject: Subject<string> =
    new Subject<string>();
  addProductSubjectData$ = this.addProductSubject.asObservable();
  removeProductSubjectData$ = this.removeProductSubject.asObservable();

  cartItemNumber: number = 0;
  subTotal: number = 0;
  cartItems: CartItem[] = [];

  constructor() {}

  addItem(data: CartItem) {
    this.addProductSubject.next(data);
  }

  removeItem(productId: string) {
    this.removeProductSubject.next(productId);
  }

  calculateSubtotal(): void {
    this.subTotal = 0;
    this.cartItems.forEach((item) => {
      this.subTotal += item.price * item.quantity;
    });

    this.cartItemNumber = this.cartItems.length;
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
