import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectUsers } from 'src/app/state/selectors/user.selectors';
import { UserService } from '../../services/user.service';
import { loadUserList, loadUserListSuccess } from 'src/app/state/actions/user.actions';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  constructor(
    private _store: Store<AppState>,
    private _userSvc: UserService
  ) { }

  ngOnInit() {
    this.getUserList();
  }

  async getUserList() {
    this._store.dispatch(loadUserList());
    const userList = await this._userSvc.getUserList(); // Obtener a los usuarios desde la base de datos
    this._store.dispatch(loadUserListSuccess({users: userList})); // Pasar los datos al store
    this._store.select(selectUsers).subscribe(userList => { // Obtener los datos del store
      console.log(userList)
    });
  }

}