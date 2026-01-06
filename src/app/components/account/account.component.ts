import { Component } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import { UserDetails } from '../../interfaces/user';
import { UserApi } from '../../api/user.api';
import { TokenService } from '../../services/token.service';
import { UpdateAccountModalComponent } from './update-account-modal/update-account-modal.component';

@Component({
  selector: 'app-account',
  imports: [IconComponent, UpdateAccountModalComponent],
  templateUrl: './account.component.html',
  styles: ``
})
export class AccountComponent {
  isUpdateAccountModelOpened = false;
  userDetails: UserDetails | null = null;

  constructor(
    private readonly userApi: UserApi,
    private readonly tokenService: TokenService
  ) {
    // Fetch user data
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
}
