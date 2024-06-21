import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {

  loading: boolean = false;
  
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
  });

  constructor(
    private _routerSvc: Router
  ) { }

  ngOnInit() {}

  async onSubmit() {
    const payload: any = {
      email: this.signupForm.controls['email'].value,
      password: this.signupForm.controls['password'].value
    }

    if(this.signupForm.invalid) return;
    this._routerSvc.navigate(['/main'])
  }

  goToLoginView(){
    this._routerSvc.navigate(['/auth/login']);
  }

}
