import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MainRoutingModule } from './main.routes';
import { MainComponent } from './views/main/main.component';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MainRoutingModule
  ]
})
export class MainModule { }
