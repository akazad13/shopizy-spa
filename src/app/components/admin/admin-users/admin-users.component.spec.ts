import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersComponent } from './admin-users.component';
import { provideRouter } from '@angular/router';
import { UserApi } from '../../../api/user.api';
import { ToastService } from '../../../services/toast.service';
import { of } from 'rxjs';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;

  beforeEach(async () => {
    const userApiMock = jasmine.createSpyObj('UserApi', ['getAllUsers', 'updateUserRole']);
    const toastServiceMock = jasmine.createSpyObj('ToastService', ['success', 'error']);

    userApiMock.getAllUsers.and.returnValue(of([]));

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
});
