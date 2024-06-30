import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  // Registro de nuevo usuario
  async signUp(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        await this.afs.collection('gym').doc(user.uid).set({
          email: user.email,
          ownerId: user.uid
        });
      }
      return userCredential;
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error en el registro: ${errorMessage}`);
    }
  }

  // Inicio de sesión
  async login(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error en el inicio de sesión: ${errorMessage}`);
    }
  }

  // Cierre de sesión
  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      throw new Error(`Error en el cierre de sesión: ${errorMessage}`);
    }
  }

  // Obtener usuario actual
  getUser() {
    return this.afAuth.authState;
  }

  // Configurar la persistencia de la autenticación
  async setPersistence() {
    try {
      await this.afAuth.setPersistence('local');
      console.log('Persistencia configurada a local');
    } catch (error) {
      console.error('Error configurando la persistencia:', error);
    }
  }

}