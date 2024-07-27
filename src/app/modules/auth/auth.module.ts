import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthRoutingModule } from './auth.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './views/signup/signup.component';
import { LoginComponent } from './views/login/login.component';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { PasswordComponent } from './views/password/password.component';



@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
    PasswordComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    LogoComponent
  ]
})
export class AuthModule { }
