import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthApi } from '../../../api/auth.api';
import {
  COMMON_TEST_IMPORTS,
  createAuthApiSpy,
  provideSpy
} from '../../../testing/test-helpers';

import { SigninComponent } from './signin.component';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(async () => {
    const authApiSpy = createAuthApiSpy();

    await TestBed.configureTestingModule({
      imports: [SigninComponent, RouterTestingModule, ...COMMON_TEST_IMPORTS],
      providers: [provideSpy(AuthApi, authApiSpy)]
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
