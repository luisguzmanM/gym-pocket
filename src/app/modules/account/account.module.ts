import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './views/account/account.component';
import { IonicModule } from '@ionic/angular';
import { AccountRoutingModule } from './account.routes';



@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
