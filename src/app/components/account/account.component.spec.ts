import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApi } from '../../api/user.api';
import {
  COMMON_TEST_IMPORTS,
  createUserApiSpy,
  provideSpy
} from '../../testing/test-helpers';

import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    const userApiSpy = createUserApiSpy();

    await TestBed.configureTestingModule({
      imports: [AccountComponent, ...COMMON_TEST_IMPORTS],
      providers: [provideSpy(UserApi, userApiSpy)]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
