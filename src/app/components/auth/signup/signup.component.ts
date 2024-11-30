import { CommonModule } from '@angular/common';
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
    imports: [
        CommonModule,
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
      phoneNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    { validators: [mustMatchValidator('password', 'confirmPassword')] }
  );

  reqInProgress = false;

  constructor(
    private authApi: AuthApi,
    private router: Router
  ) {}

  async signup(): Promise<void> {
    this.signupForm.markAllAsTouched();

    if (this.reqInProgress || this.signupForm.invalid) {
      return;
    }
    this.reqInProgress = true;
    try {
      const data = await firstValueFrom(
        this.authApi
          .signUp(
            this.signupForm.value.firstName ?? '',
            this.signupForm.value.lastName ?? '',
            this.signupForm.value.phoneNumber ?? '',
            this.signupForm.value.password ?? ''
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      );
      this.router.navigateByUrl('/');
    } catch (error) {
      handleError(this.signupForm, error);
    }
  }

  get formData() {
    return this.signupForm.controls;
  }
}
