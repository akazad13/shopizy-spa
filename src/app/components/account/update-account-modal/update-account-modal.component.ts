import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { UserDetails } from '../../../interfaces/user';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';
import { NgIf } from '@angular/common';
import { HasErrorPipe } from '../../../pipes/has-error.pipe';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-update-account-modal',
  imports: [
    IsInvalidPipe,
    NgIf,
    HasErrorPipe,
    ReactiveFormsModule,
    IconComponent
  ],
  templateUrl: './update-account-modal.component.html',
  styles: ``
})
export class UpdateAccountModalComponent implements OnChanges {
  @Input() isUpdateAccountModelOpened = false;
  @Input() userDetails: UserDetails | null = null;
  @Output() onCloseModal = new EventEmitter<boolean>();

  updateAccountForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('US', [Validators.required]),
    state: new FormControl(''),
    zipCode: new FormControl('', [Validators.required])
  });

  reqInProgress = false;

  ngOnChanges(): void {
    if (!this.userDetails) {
      return;
    }
    this.updateAccountForm.patchValue({
      email: this.userDetails.email,
      phone: this.userDetails.phone,
      firstName: this.userDetails.firstName,
      lastName: this.userDetails.lastName,
      street: this.userDetails.address?.street,
      city: this.userDetails.address?.city,
      country: this.userDetails.address?.country,
      state: this.userDetails.address?.state,
      zipCode: this.userDetails.address?.zipCode
    });
  }

  onCloseUpdateAccountModel() {
    this.onCloseModal.emit(false);
  }

  get formData() {
    return this.updateAccountForm.controls;
  }

  async updateAccount(): Promise<void> {
    this.updateAccountForm.markAllAsTouched();

    if (this.reqInProgress || this.checkoutForm.invalid) {
      return;
    }

    this.reqInProgress = true;

    const orderItems: {
      productId: string;
      quantity: number;
      color: string;
      size: string;
    }[] = [];
    const shippingAddress: Address = {
      street: this.checkoutForm.value.street,
      city: this.checkoutForm.value.city,
      state: this.checkoutForm.value.state,
      country: this.checkoutForm.value.country,
      zipCode: this.checkoutForm.value.zipCode
    };

    const seletedDeliveryMethod = this.deliveryMethods.find(
      (dm) => dm.deliveryMethod == this.checkoutForm.value.deliveryMethod
    );

    const deliveryCharge: Price = {
      amount: seletedDeliveryMethod!.price.amount,
      currency: seletedDeliveryMethod!.price.currency
    };

    this.cart$.subscribe((items) => {
      items
        .filter((i) => i.quantity > 0) // Filter out items with 0 quantity
        .forEach((item) => {
          orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size
          });
        });
    });

    try {
      const data = await firstValueFrom(
        this.orderApi
          .createOrder(
            orderItems,
            '',
            seletedDeliveryMethod!.deliveryMethod,
            deliveryCharge,
            shippingAddress
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.router.navigate(['/', 'payment', data.orderId]);
    } catch (error) {
      handleError(this.checkoutForm, error);
    }
  }
}
