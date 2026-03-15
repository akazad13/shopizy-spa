import { UserApi } from './../../../api/user.api';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { UpdateUser, UserDetails } from '../../../interfaces/user';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';

import { HasErrorPipe } from '../../../pipes/has-error.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { finalize, firstValueFrom } from 'rxjs';
import { Address } from '../../../interfaces/Address';
import { handleError } from '../../../functions/error-handler';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-account-modal',
  imports: [IsInvalidPipe, HasErrorPipe, ReactiveFormsModule, IconComponent, CommonModule],
  templateUrl: './update-account-modal.component.html',
  styles: ``
})
export class UpdateAccountModalComponent implements OnChanges {
  @Input() isUpdateAccountModelOpened = false;
  @Input() userDetails: UserDetails | null = null;
  @Output() closed = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<void>();

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

  constructor(
    private readonly userApi: UserApi,
    private readonly toastService: ToastService
  ) {}

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
    this.closed.emit(false);
  }

  get formData() {
    return this.updateAccountForm.controls;
  }

  async updateAccount(): Promise<void> {
    this.updateAccountForm.markAllAsTouched();

    if (this.reqInProgress || this.updateAccountForm.invalid) {
      return;
    }

    this.reqInProgress = true;

    const address: Address = {
      street: this.updateAccountForm.value.street,
      city: this.updateAccountForm.value.city,
      state: this.updateAccountForm.value.state,
      country: this.updateAccountForm.value.country,
      zipCode: this.updateAccountForm.value.zipCode
    };

    const updateUser: UpdateUser = {
      firstName: this.updateAccountForm.value.firstName,
      lastName: this.updateAccountForm.value.lastName,
      email: this.updateAccountForm.value.email,
      phoneNumber: this.updateAccountForm.value.phone,
      address: address
    };

    try {
      await firstValueFrom(
        this.userApi
          .updateUser(updateUser)
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.toastService.success('Profile updated successfully');
      this.updated.emit();
      this.onCloseUpdateAccountModel();
    } catch (error) {
      handleError(this.updateAccountForm, error);
    }
  }
}
