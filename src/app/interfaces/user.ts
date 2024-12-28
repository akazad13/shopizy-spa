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
  totalProductsReviewed: number;
  createdOn: Date;
  modifiedOn: Date | null;
}
