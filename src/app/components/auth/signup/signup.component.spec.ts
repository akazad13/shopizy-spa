import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthApi } from '../../../api/auth.api';

import { SignupComponent } from './signup.component';
import {
  COMMON_TEST_IMPORTS,
  createAuthApiSpy,
  provideSpy
} from '../../../testing/test-helpers';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    const authApiSpy = createAuthApiSpy();

    await TestBed.configureTestingModule({
      imports: [SignupComponent, RouterTestingModule, ...COMMON_TEST_IMPORTS],
      providers: [provideSpy(AuthApi, authApiSpy)]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
