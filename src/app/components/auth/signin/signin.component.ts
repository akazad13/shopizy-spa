import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthApi } from '../../../api/auth.api';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize, firstValueFrom } from 'rxjs';
import { handleError } from '../../../functions/error-handler';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../../pipes/has-error.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    IsInvalidPipe,
    HasErrorPipe,
    IconComponent
  ],
  providers: [AuthApi],
  templateUrl: './signin.component.html',
  styles: ``
})
export class SigninComponent {
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  reqInProgress = false;
  showPassword = false;
  constructor(
    private readonly router: Router,
    private readonly authApi: AuthApi,
    private readonly cartService: CartService
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
      this.cartService.getCartData();
      this.router.navigateByUrl('/');
    } catch (error) {
      handleError(this.signinForm, error);
    }
  }

  get formData() {
    return this.signinForm.controls;
  }
}
