import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, firstValueFrom } from 'rxjs';
import { AuthApi } from '../../../api/auth.api';
import { mustMatchValidator } from '../../../functions/must-match';
import { handleError } from '../../../functions/error-handler';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../../pipes/has-error.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    IsInvalidPipe,
    HasErrorPipe,
    IconComponent
  ],
  templateUrl: './reset-password.component.html',
  styles: ``
})
export class ResetPasswordComponent implements OnInit {
  resetToken = '';
  email = '';
  reqInProgress = false;
  showPassword = false;
  showConfirmPassword = false;

  resetForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    { validators: [mustMatchValidator('password', 'confirmPassword')] }
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authApi: AuthApi,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.resetToken = params['token'] || params['resetToken'] || '';
      this.email = params['email'] || '';
    });
  }

  get passwordValue(): string {
    return this.resetForm.get('password')?.value || '';
  }

  get passwordStrength(): { score: number; label: string; color: string } {
    const pwd = this.passwordValue;
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-200' };

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    } else if (score <= 4) {
      return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    } else {
      return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
    }
  }

  async submitReset(): Promise<void> {
    this.resetForm.markAllAsTouched();

    if (this.reqInProgress || this.resetForm.invalid) {
      return;
    }

    if (!this.resetToken) {
      this.toast.error('Invalid or missing password reset token. Please request a new link.');
      return;
    }

    this.reqInProgress = true;
    try {
      await firstValueFrom(
        this.authApi
          .resetPassword(this.resetForm.value.password!, this.resetToken)
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.toast.success('Password updated successfully! Please sign in.');
      this.router.navigateByUrl('/auth/signin');
    } catch (error) {
      handleError(this.resetForm, error);
    }
  }

  get formData() {
    return this.resetForm.controls;
  }
}
