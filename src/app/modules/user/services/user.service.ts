import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users : User[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '24-12-1992',
      docType: 'Cedula',
      docNumber: 20278065,
      startDate: '21-06-2024',
      phoneNumber: 999888777,
      photo: 'https://abc123.jpg',
      isPaymentDue: true,
      id: 'abc123',
      weight: 86
    }
  ];;

  constructor(

  ) { }

  // Here I need to get the users from firestore database
  async getUserList():Promise<User[]>{
    return this.users;
  }
}