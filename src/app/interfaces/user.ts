import { Address } from './Address';

export interface User {
  id?: string;
  email: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  token?: string | null;
  accessToken?: string | null;
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
  roles?: string[];
  isActive?: boolean;
  phoneNumber?: string | null;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: Address;
}
