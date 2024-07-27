import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AuthService } from '../../services/auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent  implements OnInit {

  loading: boolean = false;
  formCtrl: FormControl = new FormControl ('', [Validators.email]);

  constructor(
    private _routerSvc: Router,
    private _toastSvc: ToastService,
    private _authSvc: AuthService,
  ) { }

  ngOnInit() {}

  async onSubmit() {
    const email = this.formCtrl.value;

    if(this.formCtrl.invalid) return;

    try {
      await this._authSvc.updatePassword(email);
      this.loading = false;
      this.goToLoginView();
      this._toastSvc.show('Email enviado. Revisa tu bandeja de entrada ✅');
    } catch (error) {
      this._toastSvc.show('❌ No existe una cuenta con este correo o no has verificado aún tu cuenta');
    }
  }

  goToLoginView(){
    this._routerSvc.navigate(['/auth/login']);
  }

}
