import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersComponent } from './admin-users.component';
import { provideRouter } from '@angular/router';
import { UserApi } from '../../../api/user.api';
import { ToastService } from '../../../services/toast.service';
import { of, throwError } from 'rxjs';
import { UserDetails } from '../../../interfaces/user';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let userApiMock: jasmine.SpyObj<UserApi>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  const makeUser = (overrides: Partial<UserDetails> = {}): UserDetails => ({
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: null,
    phoneNumber: null,
    roles: ['User'],
    isActive: true,
    address: null,
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
    userApiMock = jasmine.createSpyObj('UserApi', [
      'getAllUsers',
      'updateUserRole'
    ]);
    toastServiceMock = jasmine.createSpyObj('ToastService', [
      'success',
      'error'
    ]);

    userApiMock.getAllUsers.and.returnValue(of([]));
    userApiMock.updateUserRole.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent],
      providers: [
        { provide: UserApi, useValue: userApiMock },
        { provide: ToastService, useValue: toastServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users and compute active/admin counts', () => {
    const users: UserDetails[] = [
      makeUser({ id: '1', roles: ['Admin'], isActive: true }),
      makeUser({ id: '2', roles: ['User'], isActive: true }),
      makeUser({ id: '3', roles: ['User'], isActive: false })
    ];
    userApiMock.getAllUsers.and.returnValue(of(users));

    component.loadUsers();

    expect(component.users.length).toBe(3);
    expect(component.activeUsers).toBe(2);
    expect(component.adminUsers).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should normalize wrapped users payload format', () => {
    userApiMock.getAllUsers.and.returnValue(
      of({
        items: { $values: [makeUser({ id: '11' }), makeUser({ id: '12' })] }
      } as any)
    );

    component.loadUsers();

    expect(component.users.length).toBe(2);
  });

  it('should show error toast when loading users fails', () => {
    userApiMock.getAllUsers.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.loadUsers();

    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Failed to load customers list'
    );
    expect(component.loading).toBeFalse();
  });

  it('getUserRoleLabel should return Admin when user has Admin role', () => {
    const role = component.getUserRoleLabel(makeUser({ roles: ['Admin'] }));
    expect(role).toBe('Admin');
  });

  it('getUserRoleLabel should return Customer when user is not admin', () => {
    const role = component.getUserRoleLabel(makeUser({ roles: ['User'] }));
    expect(role).toBe('Customer');
  });

  it('toggleRole should not call update api when confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.toggleRole(makeUser({ id: '77', roles: ['User'] }));

    expect(userApiMock.updateUserRole).not.toHaveBeenCalled();
  });

  it('toggleRole should switch User to Admin and reload on success', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'loadUsers');

    component.toggleRole(
      makeUser({ id: '77', firstName: 'Ava', roles: ['User'] })
    );

    expect(userApiMock.updateUserRole).toHaveBeenCalledWith('77', 'Admin');
    expect(toastServiceMock.success).toHaveBeenCalledWith(
      'User role updated to Admin'
    );
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('toggleRole should switch Admin to User', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.toggleRole(
      makeUser({ id: '99', firstName: 'Max', roles: ['Admin'] })
    );

    expect(userApiMock.updateUserRole).toHaveBeenCalledWith('99', 'User');
  });

  it('toggleRole should show error toast when update fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userApiMock.updateUserRole.and.returnValue(
      throwError(() => new Error('boom'))
    );

    component.toggleRole(
      makeUser({ id: '102', firstName: 'Mia', roles: ['User'] })
    );

    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Failed to update role'
    );
  });
});
