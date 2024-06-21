import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user.routes';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { UserListComponent } from './views/user-list/user-list.component';
import { UserItemComponent } from './components/user-item/user-item.component';



@NgModule({
  declarations: [
    UserListComponent,
    UserItemComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HeaderComponent
  ]
})
export class UserModule { }
