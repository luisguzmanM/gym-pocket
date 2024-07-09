import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent  implements OnInit {

  loading: boolean = false;
  userID: any = null;
  user: any = {};
  darkMode!: BehaviorSubject<boolean>;
  darkModeValue: boolean = false;

  constructor(
    private _routerSvc: Router,
    private _toastSvc: ToastService,
    private _authSvc: AuthService,
    private _cameraSvc: CameraService,
    private _themeSvc: ThemeService,
    private _alertSvc: AlertService,
    private _modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.darkMode = this._themeSvc.darkMode;
    this.darkMode.subscribe(mode => this.darkModeValue = mode);
    this.getUser();
  }

  async logOut(){
    this.loading = true;
    try {
      await this._authSvc.logout();
      console.log('Cierre de sesión exitoso');
      this.loading = false;
      this._routerSvc.navigate(['/auth/login']);
    } catch (error) {
      this.loading = false;
      this._toastSvc.show('Error al cerrar sesión ❌');
    }
  }

  async selectLogo() {
    try {
      await this._cameraSvc.selectPicture();
    } catch (error) {
      this._toastSvc.show('Error al cargar logo ❌');
    }
  }

  getUser(): void {
    this.loading = true;
    this._authSvc.getUser().subscribe(user => {
      this.userID = user?.uid;
      if(this.userID != null){
        this.getUserData();
      }
    });
  }

  getUserData(){
    this._authSvc.getUserData(this.userID).subscribe(data => {
      this.user = data;
      this.loading = false;
    })
  }

  setTheme(darkMode: boolean){
    this._themeSvc.setTheme(darkMode);
  }

  async deleteAccount() {
    this.loading = true;

    const response = await this._alertSvc.show('Advertencia', '', 'Si confirmas esta acción, se borrará toda la información de tus clientes. Esta acción no se podrá revertir. ¿Seguro que deseas eliminar la cuenta?')
    if (response !== 'confirm') return;

    try {
      await this._authSvc.deleteCollection(this.userID);
      await this._authSvc.deleteUser();
      this._routerSvc.navigate(['/auth/login'])
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this._toastSvc.show(error as string)
    }
  }

}
