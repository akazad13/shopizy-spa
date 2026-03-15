import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { UserApi } from '../../../api/user.api';
import { firstValueFrom, finalize } from 'rxjs';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../../pipes/has-error.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { handleError } from '../../../functions/error-handler';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IsInvalidPipe, HasErrorPipe, IconComponent],
  templateUrl: './change-password-modal.component.html',
  styles: ``
})
export class ChangePasswordModalComponent {
  @Input() isModalOpened = false;
  @Output() closed = new EventEmitter<boolean>();

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  reqInProgress = false;

  constructor(
    private readonly userApi: UserApi,
    private readonly toastService: ToastService
  ) { }

  onClose() {
    this.closed.emit(false);
    this.changePasswordForm.reset();
  }

  get formData() {
    return this.changePasswordForm.controls;
  }

  async onSubmit(): Promise<void> {
    this.changePasswordForm.markAllAsTouched();

    if (this.reqInProgress || this.changePasswordForm.invalid) {
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    this.reqInProgress = true;

    try {
      await firstValueFrom(
        this.userApi.updatePassword(oldPassword, newPassword).pipe(
          finalize(() => (this.reqInProgress = false))
        )
      );
      this.toastService.success('Password updated successfully');
      this.onClose();
    } catch (error) {
      handleError(this.changePasswordForm, error);
    }
  }
}
