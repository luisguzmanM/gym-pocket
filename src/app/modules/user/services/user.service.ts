import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { initializeApp } from 'firebase/app';
import { Firestore, addDoc, collection, getDoc, getDocs, getFirestore } from 'firebase/firestore';
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

  async getCustomerList():Promise<User[]>{
    const querySnapshot = await getDocs(collection(this.db, 'clientsOfMyUsers'));

    querySnapshot.forEach(doc => {
      const dataClient = doc.data() as User;
      dataClient.customerID = doc.id;
      this.users.push(dataClient);
    })

    return this.users;
  }
  
  async insertNewCustomer(user: User) {
    const docRef = await addDoc(collection(this.db, 'clientsOfMyUsers'), user);
    return await getDoc(docRef);
  }
  
  
}