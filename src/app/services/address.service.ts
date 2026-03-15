import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { AddressApi } from '../api/address.api';
import { Address } from '../interfaces/Address';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addresses: Address[] = [];
  private readonly addressesSubject = new BehaviorSubject<Address[]>([]);
  addresses$ = this.addressesSubject.asObservable();

  constructor(
    private readonly addressApi: AddressApi,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {
    this.loadAddresses();
  }

  async loadAddresses() {
    if (this.authService.loggedIn()) {
      try {
        const data = await firstValueFrom(this.addressApi.getAddresses());
        this.addresses = data;
        this.emit();
      } catch (error) {
        console.error('Failed to load addresses', error);
      }
    }
  }

  async addAddress(address: Address) {
    try {
      const newAddress = await firstValueFrom(this.addressApi.addAddress(address));
      this.addresses.push(newAddress);
      this.emit();
      this.toastService.success('Address added successfully');
    } catch (error) {
      this.toastService.error('Failed to add address');
    }
  }

  async updateAddress(address: Address) {
    try {
      const updated = await firstValueFrom(this.addressApi.updateAddress(address));
      this.addresses = this.addresses.map(a => a.id === updated.id ? updated : a);
      this.emit();
      this.toastService.success('Address updated successfully');
    } catch (error) {
       this.toastService.error('Failed to update address');
    }
  }

  async deleteAddress(addressId: string) {
    try {
      await firstValueFrom(this.addressApi.deleteAddress(addressId));
      this.addresses = this.addresses.filter(a => a.id !== addressId);
      this.emit();
      this.toastService.success('Address deleted successfully');
    } catch (error) {
      this.toastService.error('Failed to delete address');
    }
  }

  async setDefault(addressId: string) {
    try {
      await firstValueFrom(this.addressApi.setDefaultAddress(addressId));
      this.addresses = this.addresses.map(a => ({
        ...a,
        isDefault: a.id === addressId
      }));
      this.emit();
      this.toastService.success('Default address updated');
    } catch (error) {
      this.toastService.error('Failed to set default address');
    }
  }

  private emit() {
    this.addressesSubject.next([...this.addresses]);
  }
}
