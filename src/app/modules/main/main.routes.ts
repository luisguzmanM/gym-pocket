import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./views/main/main.component";
import { UserModule } from "../user/user.module";
import { AccountModule } from "../account/account.module";
import { SettingModule } from "../setting/setting.module";

const MAIN_ROUTES : Routes = [
  { path: '', 
    component: MainComponent, 
    children: [
      {
        path: '',
        redirectTo: 'user-list',
        pathMatch: 'full'
      },
      {
        path: 'user-list',
        loadChildren: () => import('../user/user.module').then(m => UserModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../account/account.module').then(m => AccountModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('../setting/setting.module').then(m => SettingModule)
      }
  ] }
]

export const MainRoutingModule = RouterModule.forChild(MAIN_ROUTES);