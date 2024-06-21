import { RouterModule, Routes } from "@angular/router";
import { StartComponent } from "./views/start/start.component";

const START_ROUTES : Routes = [
  { path: '', component: StartComponent }
];

export const StartRoutingModule = RouterModule.forChild(START_ROUTES);