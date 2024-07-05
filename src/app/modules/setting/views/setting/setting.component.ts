import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent  implements OnInit {

  loading: boolean = false;
  userID: any = null;

  constructor(
    private _routerSvc: Router,
    private _toastSvc: ToastService,
    private _authSvc: AuthService,
    private _cameraSvc: CameraService
  ) { }

  ngOnInit() {
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
      const logo = await this._cameraSvc.selectPicture();
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
        this.loading = false;
      }
    });
  }

  getUserData(){
    this._authSvc.getUserData(this.userID).subscribe(data => {
      console.log(data)  
    })
  }

}
