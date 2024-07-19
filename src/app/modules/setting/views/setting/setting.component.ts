import { Component, OnInit } from '@angular/core';
import { Reference } from '@angular/fire/compat/storage/interfaces';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  // Notification message
  settingNotificationMessage: boolean = false;
  notificationMessage: FormControl = new FormControl('', [Validators.maxLength(200)]);
  currentNotificationMessage: string = '';

  // Logo
  logo: FormControl = new FormControl('')
  currentLogoURL: string = '';

  // Business name
  settingBusinessName: boolean = false;
  businessName: FormControl = new FormControl('', [Validators.maxLength(20)]);
  currentBusinessName: string = '';
  showBlinkInBusinessName: boolean = false;

  // Password
  settingPassword: boolean = false;
  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]);
  currentPassword: string = '';

  buttonsUpdatePasswordAlertModal = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.updatePassword(false)
      },
    },
    {
      text: 'Confirmar',
      role: 'confirm',
      handler: () => {
        this.updatePassword(true)
      },
    },
  ];

  constructor(
    private _routerSvc: Router,
    private _toastSvc: ToastService,
    private _authSvc: AuthService,
    private _cameraSvc: CameraService,
    private _themeSvc: ThemeService,
    private _alertSvc: AlertService
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
      this._toastSvc.show('❌ Error al cerrar sesión');
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
      this.currentNotificationMessage = this.user.notificationMessage;
      this.currentBusinessName = this.user.businessName;
      this.currentPassword = this.user.password;
      this.currentLogoURL = this.user.logoURL
      this.loading = false;
    })
  }

  setTheme(darkMode: boolean){
    this._themeSvc.setTheme(darkMode);
  }

  async deleteAccount() {
    const businessName = this.user.businessName;

    const response = await this._alertSvc.show('Advertencia', '', 'Si confirmas esta acción, se borrará toda la información de tus clientes. Esta acción no se podrá revertir. ¿Seguro que deseas eliminar la cuenta?')
    if (response !== 'confirm') return;
    
    this.loading = true;

    try {
      await this._authSvc.deleteCollection(this.userID);
      await this._authSvc.deleteUser();      
      this._routerSvc.navigate(['/auth/login'])
      this._toastSvc.show(`✅ Se borró la cuenta del gimnasio ${businessName}`);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this._toastSvc.show(error as string)
    }
  }

  async setNotificationMessage() {
    this.loading = true;
    try {
      await this._authSvc.updateUser(this.user);
      this.loading = false;
      this.settingNotificationMessage = false;
      this._toastSvc.show('Actualización exitosa ✅');
    } catch (error) {
      this._toastSvc.show('❌ Error al guardar mensaje de notificación');
    }
  }

  async setBusinessName() {
    this.loading = true;
    try {
      await this._authSvc.updateUser(this.user);
      this.settingBusinessName = false;
      this.loading = false;
      this._toastSvc.show('Actualización exitosa ✅');
      this.showBlinkInBusinessName = true;
      setTimeout(() => {
        this.showBlinkInBusinessName = false;
      }, 3000);
    } catch (error) {
      this._toastSvc.show('❌ Error al establecer nombre');
    }
  }

  async updatePassword(option:boolean){
    if(!option) return;
    
    this.loading = true;
    try {
      await this._authSvc.updatePassword(this.user.email);
      this.settingPassword = false;
      this.loading = false;
      this.logOut();
      this._toastSvc.show('Email enviado. Revisa tu bandeja de entrada ✅');
    } catch (error) {
      
    }
  }

  async selectLogo() {
    try {
      const newLogo = await this._cameraSvc.selectPicture();
      this.currentLogoURL = newLogo.dataUrl;
      this.logo.setValue(newLogo);
      this.updateLogo()
    } catch (error) {
      this._toastSvc.show('❌ Error al seleccionar logo');
    }
  }

  async updateLogo() {
    this.loading = true;
    if(this.logo.value === '') return;

    try {
      const logoUploaded = await this._cameraSvc.uploadPhotoToCloudStorage('logo', this.logo.value);
      const logoURL = await logoUploaded.ref.getDownloadURL();

      const oldStorageRef = this.user.storageRef;
      if (oldStorageRef) {
        await this.deleteCurrentLogoAfterUploadNewLogo(oldStorageRef);
      }

      this.user.storageRef = logoUploaded.ref.fullPath;
      this.user.logoURL = logoURL;
      await this._authSvc.updateUser(this.user);

      this.loading = false;
      this._toastSvc.show('✅ Logo actualizado con éxito');
    } catch (error) {
      this._toastSvc.show('❌ Error al actualizar logo');
      console.error(error);
      this.loading = false;
    }
  }

  async deleteCurrentLogoAfterUploadNewLogo(oldStorageRef: any) {
    try {
      await this._cameraSvc.deleteAsset(oldStorageRef);
    } catch (error) {
      console.error('Error al eliminar el logo antiguo:', error);
      throw error;
    }
  }

}
