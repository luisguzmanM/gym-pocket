import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting.routes';
import { IonicModule } from '@ionic/angular';
import { SettingComponent } from './views/setting/setting.component';



@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }
