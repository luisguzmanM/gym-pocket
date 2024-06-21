import { RouterModule, Routes } from "@angular/router";
import { SettingComponent } from "./views/setting/setting.component";

const SETTING_ROUTES : Routes = [
  { path: '', component: SettingComponent }
]

export const SettingRoutingModule = RouterModule.forChild(SETTING_ROUTES);