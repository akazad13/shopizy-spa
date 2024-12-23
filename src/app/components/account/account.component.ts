import { Component } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-account',
  imports: [IconComponent],
  templateUrl: './account.component.html',
  styles: ``
})
export class AccountComponent {
  isUpdateAccountModelOpened: boolean = false;

  onEditData() {
    this.isUpdateAccountModelOpened = true;
  }
  onCloseUpdateAccountModel() {
    this.isUpdateAccountModelOpened = false;
  }
}
