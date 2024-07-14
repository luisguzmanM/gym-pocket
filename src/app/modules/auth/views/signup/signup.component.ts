import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {

  loading: boolean = false;
  
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    businessName: new FormControl('', [Validators.required])
  });

  constructor(
    private _routerSvc: Router,
    private _toastSvc: ToastService,
    private _authSvc: AuthService
  ) { }

  ngOnInit() {}

  async onSubmit() {
    const email = this.signupForm.controls['email'].value;
    const password = this.signupForm.controls['password'].value;
    const businessName = this.signupForm.controls['businessName'].value

    if(this.signupForm.invalid) return;

    try {
      await this._authSvc.signUp(email, password, businessName);
      this._routerSvc.navigate(['/main']);
      this._toastSvc.show(`✅ Gimnasio ${businessName} registrado exitosamente`);
    } catch (error) {
      this._toastSvc.show('❌ Error al registrar cuenta');
    }

  }

  goToLoginView(){
    this._routerSvc.navigate(['/auth/login']);
  }

}
