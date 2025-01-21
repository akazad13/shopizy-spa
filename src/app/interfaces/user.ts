import { Address } from './Address';

export interface User {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar: string;
  token: string;
}

export interface UserDetails {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  address: Address | null;
  profileImageUrl: string | null;
  totalOrders: number;
  totalReviewed: number;
  totalFavorites: number;
  totalReturns: number;
  createdOn: Date;
  modifiedOn: Date | null;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: Address;
}
