import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../../services/address.service';
import { Address } from '../../../interfaces/Address';
import { Observable } from 'rxjs';
import { IconComponent } from '../../shared/icon/icon.component';
import { AddressModalComponent } from './address-modal/address-modal.component';

@Component({
  selector: 'app-address-management',
  standalone: true,
  imports: [CommonModule, IconComponent, AddressModalComponent],
  templateUrl: './address-management.component.html',
  styles: ``
})
export class AddressManagementComponent implements OnInit {
  addresses$!: Observable<Address[]>;
  isModalOpened = false;
  selectedAddress: Address | null = null;

  constructor(private readonly addressService: AddressService) {}

  ngOnInit(): void {
    this.addresses$ = this.addressService.addresses$;
  }

  openAddModal() {
    this.selectedAddress = null;
    this.isModalOpened = true;
  }

  openEditModal(address: Address) {
    this.selectedAddress = address;
    this.isModalOpened = true;
  }

  onDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(id);
    }
  }

  onSetDefault(id: string) {
    this.addressService.setDefault(id);
  }

  onCloseModal(val: boolean) {
    this.isModalOpened = val;
  }
}
