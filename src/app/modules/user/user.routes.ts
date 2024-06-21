import { RouterModule, Routes } from "@angular/router";
import { UserListComponent } from "./views/user-list/user-list.component";

const USER_ROUTES : Routes = [
  { path: '', component: UserListComponent }
];

export const UserRoutingModule = RouterModule.forChild(USER_ROUTES);