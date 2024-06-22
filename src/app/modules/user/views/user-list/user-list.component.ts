import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectLoading, selectUsers } from 'src/app/state/selectors/user.selectors';
import { UserService } from '../../services/user.service';
import { loadUserList, loadUserListSuccess } from 'src/app/state/actions/user.actions';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  userList$: Observable<User[]> = this._store.select((selectUsers));
  loading$: Observable<boolean> = this._store.select((selectLoading));

  constructor(
    private _store: Store<AppState>,
    private _userSvc: UserService
  ) { }

  ngOnInit() {
    this.getUserList();
  }

  async getUserList() {
    this._store.dispatch(loadUserList());
    const userList = await this._userSvc.getClientList(); // Get clients from database.
    this._store.dispatch(loadUserListSuccess({users: userList})); // Save clients inside store.
  }

}