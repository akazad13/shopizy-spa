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
  saving: number = 0;

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
      this.saving += ((item.price * item.discount) / 100) * item.quantity;
    });

    this.cartItemNumber = this.cartItems.length;
  }
}

export class CartItem {
  constructor(
    cartItemId: string | null,
    productId: string,
    image: string | undefined,
    name: string,
    price: number,
    discount: number,
    quantity: number,
    color: string,
    size: string
  ) {
    this.cartItemId = cartItemId;
    this.productId = productId;
    this.image = image;
    this.name = name;
    this.price = price;
    this.discount = discount;
    this.quantity = quantity;
    this.color = color;
    this.size = size;
  }
  cartItemId: string | null;
  productId: string;
  image: string | undefined;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  color: string;
  size: string;
}
