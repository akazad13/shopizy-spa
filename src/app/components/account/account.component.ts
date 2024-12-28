import { Component } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import { UserDetails } from '../../interfaces/user';
import { UserApi } from '../../api/user.api';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-account',
  imports: [IconComponent],
  templateUrl: './account.component.html',
  styles: ``
})
export class AccountComponent {
  isUpdateAccountModelOpened: boolean = false;
  userDetails: UserDetails | null = null;

  constructor(
    private readonly userApi: UserApi,
    private readonly tokenService: TokenService
  ) {
    // Fetch user data
    this.userApi
      .getUser(this.tokenService.getCurrentUserId())
      .subscribe((user: UserDetails) => {
        this.userDetails = user;
      });
  }
  onEditData() {
    this.isUpdateAccountModelOpened = true;
  }
  onCloseUpdateAccountModel() {
    this.isUpdateAccountModelOpened = false;
  }
}
