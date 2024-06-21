import { RouterModule, Routes } from "@angular/router";
import { SignupComponent } from "./views/signup/signup.component";
import { LoginComponent } from "./views/login/login.component";

const AUTH_ROUTES : Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
];

export const AuthRoutingModule = RouterModule.forChild(AUTH_ROUTES);