import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent  implements OnInit {

  constructor(
    private _routerSvc: Router,
    private _toastSvc: ToastService,
    private _authSvc: AuthService,
  ) { }

  ngOnInit() {}

  async logOut(){
    try {
      await this._authSvc.logout();
      console.log('Cierre de sesión exitoso');
      this._routerSvc.navigate(['/auth/login']);
    } catch (error) {
      this._toastSvc.show('Error al cerrar sesión ❌')
    }
  }

}
