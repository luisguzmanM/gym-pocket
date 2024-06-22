export type User = {
  userID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  typeDocIdentity: string;
  docNumber: number;
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