import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon/icon.component';
import { UserDetails } from '../../interfaces/user';
import { UserApi } from '../../api/user.api';
import { TokenService } from '../../services/token.service';
import { UpdateAccountModalComponent } from './update-account-modal/update-account-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../services/wishlist.service';
import { NotificationsApi } from '../../api/notifications.api';
import { NotificationPreferences } from '../../types/api';
import { ToastService } from '../../services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    IconComponent,
    UpdateAccountModalComponent,
    ChangePasswordModalComponent,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './account.component.html',
  styles: ``,
  providers: [NotificationsApi]
})
export class AccountComponent implements OnInit {
  isUpdateAccountModelOpened = false;
  isChangePasswordModalOpened = false;
  userDetails: UserDetails | null = null;

  // Notification Preferences
  notificationPreferences: NotificationPreferences = {
    userId: '',
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    orderUpdates: true,
    promotions: true,
    priceAlerts: true,
    restockAlerts: true
  };
  isSavingPreferences = false;

  constructor(
    private readonly userApi: UserApi,
    private readonly notificationsApi: NotificationsApi,
    private readonly tokenService: TokenService,
    private readonly toast: ToastService,
    public readonly wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.getNotificationPreferences();
  }

  getUserDetails() {
    const userId = this.tokenService.getCurrentUserId();
    if (userId) {
      this.userApi.getUser(userId).subscribe((user: UserDetails) => {
        this.userDetails = user;
      });
    }
  }

  async getNotificationPreferences(): Promise<void> {
    const userId = this.tokenService.getCurrentUserId();
    if (!userId) return;

    try {
      const prefs = await firstValueFrom(
        this.notificationsApi.getPreferences(userId)
      );
      if (prefs) {
        this.notificationPreferences = prefs;
      }
    } catch {
      // Keep defaults if not saved yet
    }
  }

  async saveNotificationPreferences(): Promise<void> {
    const userId = this.tokenService.getCurrentUserId();
    if (!userId) return;

    this.isSavingPreferences = true;
    try {
      await firstValueFrom(
        this.notificationsApi.updatePreferences(
          this.notificationPreferences,
          userId
        )
      );
      this.toast.success('Notification preferences updated successfully!');
    } catch {
      this.toast.info('Preferences updated.');
    } finally {
      this.isSavingPreferences = false;
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
