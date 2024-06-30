import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  // Registro de nuevo usuario
  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Inicio de sesión
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Cierre de sesión
  logout() {
    return this.afAuth.signOut();
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