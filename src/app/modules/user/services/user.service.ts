import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { initializeApp } from 'firebase/app';
import { Firestore, addDoc, collection, getDoc, getDocs, getFirestore, query } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public firestoreInstance: Firestore;
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  users : User[] = [];

  constructor(private afAuth: AngularFireAuth) {
    this.firestoreInstance = getFirestore();
  }

  // Obtener la lista de clientes del gimnasio del usuario actual
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

  // Insertar un nuevo cliente en el gimnasio del usuario actual
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
}
