export interface Address {
  id?: string;
  label?: string; // e.g. Home, Office
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}
