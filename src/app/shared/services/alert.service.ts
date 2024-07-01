import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private _alertCtrl: AlertController
  ) { }

  async show(header: string, subHeader: string, message:string){
    const alert = await this._alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          role: 'confirm'
        },
      ]
    })
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role;
  }
}

