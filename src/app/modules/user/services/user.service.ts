import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { initializeApp } from 'firebase/app';
import { Firestore, addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public firestoreInstance: Firestore;
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  users : User[] = [];

  constructor() {
    this.firestoreInstance = getFirestore();
  }

  async getClientList():Promise<User[]>{
    const querySnapshot = await getDocs(collection(this.db, 'clientsOfMyUsers'));

    querySnapshot.forEach(doc => {
      const dataClient = doc.data() as User;
      dataClient.customerID = doc.id;
      this.users.push(dataClient);
    })

    return this.users;
  }
  
  async insertNewCustomer(user: User) {
    const { 
      customerID,
      firstName, 
      lastName, 
      dateOfBirth, 
      typeDocIdentity, 
      docNumber, 
      countryCode, 
      phoneNumber, 
      startDate, 
      photoURL,
    } = user;

    const docRef = await addDoc(collection(this.db, 'clientsOfMyUsers'), {
      customerID: customerID,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      typeDocIdentity: typeDocIdentity,
      docNumber: docNumber,
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      startDate: startDate,
      photoURL: photoURL
    })

    return docRef;
  }

}