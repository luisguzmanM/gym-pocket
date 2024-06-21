import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


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
    private _routerSvc: Router
  ) { }

  ngOnInit() {}

  async onSubmit() {
    const payload: any = {
      email: this.loginFormCtrl.controls['email'].value,
      password: this.loginFormCtrl.controls['password'].value
    }

    if(this.loginFormCtrl.invalid) return;
    this._routerSvc.navigate(['/main'])
  }

  goToLoginView(){
    this._routerSvc.navigate(['/auth/signup']);
  }

}
