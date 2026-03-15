import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon.component';
import { UserDetails } from '../../interfaces/user';
import { UserApi } from '../../api/user.api';
import { TokenService } from '../../services/token.service';
import { UpdateAccountModalComponent } from './update-account-modal/update-account-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { AddressManagementComponent } from './address-management/address-management.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [IconComponent, UpdateAccountModalComponent, ChangePasswordModalComponent, AddressManagementComponent, CommonModule, RouterLink],
  templateUrl: './account.component.html',
  styles: ``
})
export class AccountComponent implements OnInit {
  isUpdateAccountModelOpened = false;
  isChangePasswordModalOpened = false;
  userDetails: UserDetails | null = null;

  constructor(
    private readonly userApi: UserApi,
    private readonly tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    const userId = this.tokenService.getCurrentUserId();
    if (userId) {
      this.userApi.getUser(userId).subscribe((user: UserDetails) => {
        this.userDetails = user;
      });
    }
  }

  onEditData() {
    this.isUpdateAccountModelOpened = true;
  }
  onCloseUpdateAccountModel(val: boolean) {
    this.isUpdateAccountModelOpened = val;
  }
  onToggleChangePasswordModal(val: boolean) {
    this.isChangePasswordModalOpened = val;
  }
}
