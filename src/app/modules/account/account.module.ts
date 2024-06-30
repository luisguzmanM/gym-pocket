import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './views/account/account.component';
import { IonicModule } from '@ionic/angular';
import { AccountRoutingModule } from './account.routes';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';



@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AccountRoutingModule,
    HeaderComponent
  ]
})
export class AccountModule { }
