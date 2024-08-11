export type User = {
  customerID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  typeDocIdentity: string;
  docNumber: string;
  countryCode: number
  phoneNumber: number;
  photoURL: string;
  membership: Membership;
  error?:any
}

export type Membership = {
  type: string;
  startDate: string;
  expiryDate: string;
  status: string;
}

export type MembershipType = {
  type: string;
  description: string;
}

export interface UserListState {
  loading: boolean;
  users: User[];
}