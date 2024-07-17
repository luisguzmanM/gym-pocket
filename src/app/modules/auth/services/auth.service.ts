import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { initializeApp } from 'firebase/app';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, User  } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  auth = getAuth();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  async registerWithEmailAndPassword(email:string, password:string, businessName: string):Promise<UserCredential>{
    try {
      const newUserCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const { user } = newUserCredential;

      if (user) {
        await this.afs.collection('gym').doc(user.uid).set({
          email: user.email,          
          ownerId: user.uid,
          logoURL: 'https://ionicframework.com/docs/img/demos/avatar.svg',
          businessName: businessName,
          password: password,
          notificationMessage: `Estimado usuario, ${businessName} te recuerda ponerte al día con tu mensualidad`,
        });
      }

      await sendEmailVerification(user);

      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error en el inicio de sesión: ${errorMessage}`);
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error en el cierre de sesión: ${errorMessage}`);
    }
  }

  getUser() {
    return this.afAuth.authState;
  }

  getUserData(uid: string): Observable<any> {
    return this.afs.collection('gym').doc(uid).valueChanges();
  }

  async setAuthPersistence() {
    try {
      await this.afAuth.setPersistence('local');
    } catch (error) {
      console.error('Error configurando la persistencia:', error);
    }
  }

  async deleteCollection(uid:string){
    try {
      await this.afs.collection('gym').doc(uid).delete();
    } catch (error) {
      throw new Error ('Error al borrar la colección del gimnasio');
    }
  }

  async deleteUser(){
    try {
      const currentUser = await this.afAuth.currentUser;
      await currentUser?.delete();
    } catch (error) {
      throw new Error ('Error al borrar al usuario');
    }
  }

  async updateUser(gym:any) {
    if(gym){
      const affiliateDocRef = doc(this.db, `gym/${gym.ownerId}`);
      return await updateDoc(affiliateDocRef, gym);
    } else {
      throw new Error ('Error al actualizar usuario');
    }
  }

}

type UserCredential = {
  user: User
}