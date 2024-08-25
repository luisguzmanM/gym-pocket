import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  loading: boolean = false;
  
  loginFormCtrl: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
  });

  constructor(
    private _routerSvc: Router,
    private _toastSvc: ToastService,
    private _authSvc: AuthService,
  ) { }

  ngOnInit() {}

  async onSubmit() {
    const email = this.loginFormCtrl.controls['email'].value;
    const password = this.loginFormCtrl.controls['password'].value;

    if(this.loginFormCtrl.invalid) return;

    try {
      const res = await this._authSvc.login(email, password);

      if(res.user?.emailVerified){
        this._routerSvc.navigate(['/main'])
        this._toastSvc.show(`✅ Inicio de sesión exitoso`);
      } else {
        this._toastSvc.show(`❌ Parece que no has verificado tu cuenta mediante el link enviado a ${email}`);
      }

    } catch (error) {
      this._toastSvc.show('❌ No existe una cuenta a este correo o la contraseña no es correcta');
    }

  }

  goToLoginView(){
    this._routerSvc.navigate(['/auth/signup']);
  }

  goToResetPassword(){
    this._routerSvc.navigate(['/auth/reset-password'])
  }

}
