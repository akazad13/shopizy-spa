import { Address } from './Address';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  token: string | null;
  phone?: string | null;
}

export interface UserDetails {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  address: Address | null;
  profileImageUrl: string | null;
  totalOrders: number;
  totalReviewed: number;
  totalFavorites: number;
  totalReturns: number;
  createdOn: Date;
  modifiedOn: Date | null;
  roles?: string[];
  isActive?: boolean;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: Address;
}
