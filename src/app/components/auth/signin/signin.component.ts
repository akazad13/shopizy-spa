import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthApi } from '../../../api/auth.api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize, firstValueFrom } from 'rxjs';
import { handleError } from '../../../functions/error-handler';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../../pipes/has-error.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    IsInvalidPipe,
    HasErrorPipe,
    IconComponent
  ],
  templateUrl: './signin.component.html',
  styles: ``
})
export class SigninComponent {
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });

  reqInProgress = false;
  showPassword = false;
  isForgotPasswordOpen = false;
  forgotEmail = '';
  isSendingReset = false;

  constructor(
    private readonly router: Router,
    private readonly authApi: AuthApi,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService,
    private readonly toast: ToastService
  ) {}

  async signin(): Promise<void> {
    this.signinForm.markAllAsTouched();

    if (this.reqInProgress || this.signinForm.invalid) {
      return;
    }
    this.reqInProgress = true;
    try {
      await firstValueFrom(
        this.authApi
          .signIn(
            this.signinForm.value.email ?? '',
            this.signinForm.value.password ?? ''
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.toast.success('Welcome back to Shopizy!');
      this.cartService.getCartData();
      this.wishlistService.loadWishlist();
      this.router.navigateByUrl('/');
    } catch (error) {
      handleError(this.signinForm, error);
    }
  }

  async sendPasswordReset(): Promise<void> {
    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.toast.error('Please enter a valid email address');
      return;
    }

    this.isSendingReset = true;
    try {
      await firstValueFrom(this.authApi.forgetPassword(this.forgotEmail.trim()));
      this.toast.success('Password reset instructions sent to your email.');
      this.isForgotPasswordOpen = false;
      this.forgotEmail = '';
    } catch {
      this.toast.info('If this email is registered, instructions have been sent.');
      this.isForgotPasswordOpen = false;
      this.forgotEmail = '';
    } finally {
      this.isSendingReset = false;
    }
  }

  get formData() {
    return this.signinForm.controls;
  }
}
