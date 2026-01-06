import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApi } from '../../../api/user.api';

import { UpdateAccountModalComponent } from './update-account-modal.component';
import {
  COMMON_TEST_IMPORTS,
  createUserApiSpy,
  provideSpy
} from '../../../testing/test-helpers';

describe('UpdateAccountModalComponent', () => {
  let component: UpdateAccountModalComponent;
  let fixture: ComponentFixture<UpdateAccountModalComponent>;

  beforeEach(async () => {
    const userApiSpy = createUserApiSpy();

    await TestBed.configureTestingModule({
      imports: [UpdateAccountModalComponent, ...COMMON_TEST_IMPORTS],
      providers: [provideSpy(UserApi, userApiSpy)]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
