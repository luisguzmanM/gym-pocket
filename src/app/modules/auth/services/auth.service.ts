import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  async signUp(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        await this.afs.collection('gym').doc(user.uid).set({
          email: user.email,
          ownerId: user.uid,
          logoURL: 'https://i.postimg.cc/ZRx80WDt/Dark-Blue-and-Brown-Illustrative-Fitness-Gym-Logo.png',
          comertialName: 'Iron Gym',
          notificationMessage: 'Estimado usuario, tu gimnasio te recuerda ponerte al día con tu mensualidad.',
          theme: 'light'
        });
      }
      return userCredential;
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error en el registro: ${errorMessage}`);
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
      console.log('Persistencia configurada a local');
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

}