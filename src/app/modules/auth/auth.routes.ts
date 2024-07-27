import { RouterModule, Routes } from "@angular/router";
import { SignupComponent } from "./views/signup/signup.component";
import { LoginComponent } from "./views/login/login.component";
import { PasswordComponent } from "./views/password/password.component";

const AUTH_ROUTES : Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'reset-password', component: PasswordComponent },
];

export const AuthRoutingModule = RouterModule.forChild(AUTH_ROUTES);