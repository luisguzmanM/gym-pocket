import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./views/account/account.component";

const ACCOUNT_ROUTES : Routes = [
  { path: '', component: AccountComponent }
]

export const AccountRoutingModule = RouterModule.forChild(ACCOUNT_ROUTES);