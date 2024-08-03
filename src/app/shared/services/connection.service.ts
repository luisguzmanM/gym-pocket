import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  /**
   * Observables: (Subject | BehaviorSubject)
   * Canales de información por los cuales se emiten eventos donde cada evento tiene una información asociada.
   * 
   * Diferencias: 
   * 
   * Subject: No tiene posibilidad de compartir información que ya se ha emitido.
   * BehaviorSubject: Tiene la posibilidad de compartir informacion que ya se ha emitido a los componentes que se suscriban a él.
   * 
   * BehaviorSubject tiene un buffer que va a estar compartiendo la última información que va pasando por él.
   */

  private networkConnectionObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }

  getNetworkConnection() {
    return this.networkConnectionObservable.asObservable();
  }

  setNetworkConnection(connected:boolean) {
    this.networkConnectionObservable.next(connected);
  }
}
