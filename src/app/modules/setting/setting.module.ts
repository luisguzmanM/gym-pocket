import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting.routes';
import { IonicModule } from '@ionic/angular';
import { SettingComponent } from './views/setting/setting.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';



@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SettingRoutingModule,
    HeaderComponent
  ]
})
export class SettingModule { }
