import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user.routes';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { UserListComponent } from './views/user-list/user-list.component';
import { UserItemComponent } from './components/user-item/user-item.component';
import { IonicModule } from '@ionic/angular';
import { UserRegistrationModalComponent } from './components/user-registration-modal/user-registration-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailComponent } from './views/user-detail/user-detail.component';
import { UserPanelInfoComponent } from './components/user-panel-info/user-panel-info.component';
import { UserPanelUpdateInfoComponent } from './components/user-panel-update-info/user-panel-update-info.component';
import { CountryModalComponent } from 'src/app/shared/components/country-modal/country-modal.component';



@NgModule({
  declarations: [
    UserListComponent,
    UserItemComponent,
    UserRegistrationModalComponent,
    UserDetailComponent,
    UserPanelInfoComponent,
    UserPanelUpdateInfoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    UserRoutingModule,
    HeaderComponent,
    FormsModule,
    CountryModalComponent
  ]
})
export class UserModule { }
