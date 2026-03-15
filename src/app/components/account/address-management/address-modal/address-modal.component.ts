import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Address } from '../../../../interfaces/Address';
import { AddressService } from '../../../../services/address.service';
import { IconComponent } from '../../../shared/icon/icon.component';
import { IsInvalidPipe } from '../../../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../../../pipes/has-error.pipe';

@Component({
  selector: 'app-address-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, IsInvalidPipe, HasErrorPipe],
  templateUrl: './address-modal.component.html',
  styles: ``
})
export class AddressModalComponent implements OnChanges {
  @Input() isOpened = false;
  @Input() address: Address | null = null;
  @Output() closed = new EventEmitter<boolean>();

  addressForm: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('US', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    isDefault: new FormControl(false)
  });

  constructor(private readonly addressService: AddressService) {}

  ngOnChanges(): void {
    if (this.address) {
      this.addressForm.patchValue(this.address);
    } else {
      this.addressForm.reset({ country: 'US', isDefault: false });
    }
  }

  onClose() {
    this.closed.emit(false);
  }

  get formData() {
    return this.addressForm.controls;
  }

  async onSubmit() {
    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid) return;

    const val = this.addressForm.value;
    if (this.address) {
      await this.addressService.updateAddress({ ...this.address, ...val });
    } else {
      await this.addressService.addAddress(val);
    }
    this.onClose();
  }
}
