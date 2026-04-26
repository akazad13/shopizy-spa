import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { UserApi } from '../../../api/user.api';
import { ToastService } from '../../../services/toast.service';
import { UserDetails } from '../../../interfaces/user';

import { UpdateAccountModalComponent } from './update-account-modal.component';
import {
  COMMON_TEST_IMPORTS,
  createUserApiSpy,
  provideSpy
} from '../../../testing/test-helpers';

describe('UpdateAccountModalComponent', () => {
  let component: UpdateAccountModalComponent;
  let fixture: ComponentFixture<UpdateAccountModalComponent>;
  let userApiSpy: jasmine.SpyObj<UserApi>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const makeUserDetails = (
    overrides: Partial<UserDetails> = {}
  ): UserDetails => ({
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123',
    phoneNumber: '123',
    roles: ['User'],
    isActive: true,
    address: {
      street: 'Main Street',
      city: 'Austin',
      state: 'TX',
      country: 'US',
      zipCode: '78701'
    },
    profileImageUrl: null,
    totalOrders: 0,
    totalReviewed: 0,
    totalFavorites: 0,
    totalReturns: 0,
    createdOn: new Date(),
    modifiedOn: null,
    ...overrides
  });

  beforeEach(async () => {
    userApiSpy = createUserApiSpy();
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success']);

    await TestBed.configureTestingModule({
      imports: [UpdateAccountModalComponent, ...COMMON_TEST_IMPORTS],
      providers: [
        provideSpy(UserApi, userApiSpy),
        provideSpy(ToastService, toastServiceSpy)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges should patch form values from user details', () => {
    component.userDetails = makeUserDetails({
      firstName: 'Ava',
      lastName: 'Stone',
      phoneNumber: '555-1',
      address: {
        street: 'Elm',
        city: 'Dallas',
        state: 'TX',
        country: 'US',
        zipCode: '75001'
      }
    });

    component.ngOnChanges();

    expect(component.formData['firstName'].value).toBe('Ava');
    expect(component.formData['lastName'].value).toBe('Stone');
    expect(component.formData['phone'].value).toBe('555-1');
    expect(component.formData['street'].value).toBe('Elm');
    expect(component.formData['city'].value).toBe('Dallas');
    expect(component.formData['country'].value).toBe('US');
    expect(component.formData['state'].value).toBe('TX');
    expect(component.formData['zipCode'].value).toBe('75001');
  });

  it('ngOnChanges should keep current form when user details are null', () => {
    component.formData['firstName'].setValue('Current');
    component.userDetails = null;

    component.ngOnChanges();

    expect(component.formData['firstName'].value).toBe('Current');
  });

  it('onCloseUpdateAccountModel should emit false', () => {
    spyOn(component.closed, 'emit');

    component.onCloseUpdateAccountModel();

    expect(component.closed.emit).toHaveBeenCalledWith(false);
  });

  it('updateAccount should not call api when form is invalid', async () => {
    component.updateAccountForm.patchValue({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      country: 'US',
      zipCode: ''
    });

    await component.updateAccount();

    expect(userApiSpy.updateUser).not.toHaveBeenCalled();
    expect(component.formData['firstName'].touched).toBeTrue();
  });

  it('updateAccount should not call api while request is in progress', async () => {
    component.reqInProgress = true;
    component.updateAccountForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      street: 'Street',
      city: 'Austin',
      country: 'US',
      zipCode: '12345'
    });

    await component.updateAccount();

    expect(userApiSpy.updateUser).not.toHaveBeenCalled();
  });

  it('updateAccount should call api with mapped payload and emit success events', async () => {
    spyOn(component.updated, 'emit');
    spyOn(component.closed, 'emit');
    userApiSpy.updateUser.and.returnValue(of({}));
    component.updateAccountForm.patchValue({
      phone: '0170000',
      firstName: 'John',
      lastName: 'Doe',
      street: 'Main',
      city: 'Austin',
      country: 'US',
      state: 'TX',
      zipCode: '78701'
    });

    await component.updateAccount();

    expect(userApiSpy.updateUser).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '0170000',
      address: {
        street: 'Main',
        city: 'Austin',
        state: 'TX',
        country: 'US',
        zipCode: '78701'
      }
    });
    expect(component.reqInProgress).toBeFalse();
    expect(toastServiceSpy.success).toHaveBeenCalledWith(
      'Profile updated successfully'
    );
    expect(component.updated.emit).toHaveBeenCalled();
    expect(component.closed.emit).toHaveBeenCalledWith(false);
  });

  it('updateAccount should call handleError on api failure and reset request flag', async () => {
    userApiSpy.updateUser.and.returnValue(throwError(() => new Error('boom')));
    component.updateAccountForm.patchValue({
      phone: '0170000',
      firstName: 'John',
      lastName: 'Doe',
      street: 'Main',
      city: 'Austin',
      country: 'US',
      state: 'TX',
      zipCode: '78701'
    });

    await component.updateAccount();

    expect(component.updateAccountForm.errors).toEqual({ server: 'boom' });
    expect(component.reqInProgress).toBeFalse();
    expect(toastServiceSpy.success).not.toHaveBeenCalled();
  });
});
