import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { mustMatchValidator } from '../../../functions/must-match';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../../pipes/has-error.pipe';
import { handleError } from '../../../functions/error-handler';
import { finalize, firstValueFrom } from 'rxjs';
import { AuthApi } from '../../../api/auth.api';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    IsInvalidPipe,
    HasErrorPipe,
    IconComponent
  ],
  providers: [AuthApi],
  templateUrl: './signup.component.html',
  styles: ``
})
export class SignupComponent {
  signupForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    { validators: [mustMatchValidator('password', 'confirmPassword')] }
  );

  reqInProgress = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private readonly authApi: AuthApi,
    private readonly router: Router
  ) { }

  async signup(): Promise<void> {
    this.signupForm.markAllAsTouched();

    if (this.reqInProgress || this.signupForm.invalid) {
      return;
    }
    this.reqInProgress = true;
    try {
      await firstValueFrom(
        this.authApi
          .signUp(
            this.signupForm.value.firstName ?? '',
            this.signupForm.value.lastName ?? '',
            this.signupForm.value.email ?? '',
            this.signupForm.value.password ?? ''
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.router.navigateByUrl('/auth/signin');
    } catch (error) {
      handleError(this.signupForm, error);
    }
  }

  get formData() {
    return this.signupForm.controls;
  }
}
