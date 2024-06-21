export type User = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  docType: string;
  docNumber: number;
  startDate: string;
  phoneNumber: number;
  photo: string;
  isPaymentDue: boolean;
  id: string;
  weight: number;
}

export interface UserListState {
  loading: boolean;
  users: User[];
}