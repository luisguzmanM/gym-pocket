import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartRoutingModule } from './start.routes';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { StartComponent } from './views/start/start.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StartComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    StartRoutingModule,
    LogoComponent,
    FormsModule
  ]
})
export class StartModule { }
