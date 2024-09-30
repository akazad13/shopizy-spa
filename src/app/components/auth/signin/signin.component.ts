import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from '../../../api/auth.api';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize, firstValueFrom } from 'rxjs';
import { handleError } from '../../../functions/error-handler';
import { IsInvalidPipe } from '../../../pipes/is-invalid.pipe';
import { HasErrorPipe } from '../../../pipes/has-error.pipe';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IsInvalidPipe, HasErrorPipe],
  providers: [AuthApi],
  templateUrl: './signin.component.html',
  styles: ``
})
export class SigninComponent {
  signinForm: FormGroup;
  reqInProgress = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authApi: AuthApi
  ) {
    this.signinForm = this.fb.group({
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  async signin() {
    console.log(
      this.signinForm.value.phoneNumber,
      this.signinForm.value.password,
      this.signinForm.invalid,
      this.signinForm
    );
    this.signinForm.markAllAsTouched();

    if (this.reqInProgress || this.signinForm.invalid) {
      return;
    }
    this.reqInProgress = true;
    console.log(this.reqInProgress);
    try {
      const data = await firstValueFrom(
        this.authApi
          .signIn(
            this.signinForm.value.phoneNumber,
            this.signinForm.value.password
          )
          .pipe(finalize(() => (this.reqInProgress = false)))
      ).then((value) => {
        this.router.navigateByUrl('/');
      });
    } catch (error) {
      handleError(this.signinForm, error);
    }
  }

  get formData() {
    return this.signinForm.controls;
  }
}
