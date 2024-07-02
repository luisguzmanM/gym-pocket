import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  users : User[] = [];

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  async getAffiliateList(): Promise<User[]> {
    const user = await this.afAuth.currentUser;
    
    if (user) {
      const gymID = user.uid;
      const clientsQuery = query(collection(this.db, `gym/${gymID}/affiliate`));
      const querySnapshot = await getDocs(clientsQuery);

      this.users = [];

      querySnapshot.forEach(doc => {
        const dataClient = doc.data() as User;
        dataClient.customerID = doc.id;
        this.users.push(dataClient);
      });

      return this.users;
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  async createAffiliate(user: User) {
    const currentUser = await this.afAuth.currentUser;
    if (currentUser) {
      const gymID = currentUser.uid;
      const docRef = await addDoc(collection(this.db, `gym/${gymID}/affiliate`), user);
      return await getDoc(docRef);
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  async deleteAffiliate(customerID: string): Promise<void> {
    const user = await this.afAuth.currentUser;

    if (user) {
      const gymID = user.uid;
      const affiliateDocRef = doc(this.db, `gym/${gymID}/affiliate/${customerID}`);
      await deleteDoc(affiliateDocRef);
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  async updateAffiliate(affiliateData: User) {
    const { customerID } = affiliateData;
    const user = await this.afAuth.currentUser;

    if (user) {
      const gymID = user.uid;
      const affiliateDocRef = doc(this.db, `gym/${gymID}/affiliate/${customerID}`);
      await updateDoc(affiliateDocRef, affiliateData);
    } else {
      throw new Error('Usuario no autenticado');
    }
  }
  
}
