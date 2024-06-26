export type User = {
  customerID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  typeDocIdentity: string;
  docNumber: string;
  startDate: string;
  countryCode: number
  phoneNumber: number;
  photoURL: string;
  isPaymentDue: boolean;
  error?:any
}

export interface UserListState {
  loading: boolean;
  users: User[];
}