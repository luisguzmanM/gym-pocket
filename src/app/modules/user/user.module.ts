import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user.routes';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { UserListComponent } from './views/user-list/user-list.component';
import { UserItemComponent } from './components/user-item/user-item.component';
import { IonicModule } from '@ionic/angular';
import { UserRegistrationModalComponent } from './components/user-registration-modal/user-registration-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserListComponent,
    UserItemComponent,
    UserRegistrationModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    UserRoutingModule,
    HeaderComponent
  ]
})
export class UserModule { }
