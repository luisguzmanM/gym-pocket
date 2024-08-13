import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectLoading, selectUsers } from 'src/app/state/selectors/user.selectors';
import { UserService } from '../../services/user.service';
import { addUser, loadUserList, loadUserListSuccess, removeUser, updateAffiliateData } from 'src/app/state/actions/user.actions';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { UserRegistrationModalComponent } from '../../components/user-registration-modal/user-registration-modal.component';

import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { ConnectionService } from 'src/app/shared/services/connection.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})

export class UserListComponent implements OnInit {

  userList$: Observable<User[]> = this._store.select((selectUsers));
  loading$: Observable<boolean> = this._store.select((selectLoading));
  loading: boolean = false;
  lastAddedUserID: string | null = null;
  isConnected: boolean = true;

  constructor(
    private _store: Store<AppState>,
    private _userSvc: UserService,
    private _modalCtrl: ModalController,
    private _platform: Platform,
    private _location: Location,
    private _router: Router,
    private _connectionSvc: ConnectionService
  ) { }

  ngOnInit() {
    this._connectionSvc.getNetworkConnection().subscribe(res => res === true ? this.getUserList() : null);
    this.initializeApp();
    this.loading$.subscribe(res => res ? this.loading = true : this.loading = false);
  }

  initializeApp() {
    this._platform.ready().then(() => {
      this._platform.backButton.subscribeWithPriority(10, () => {
        const currentUrl = this._router.url;
        const mainRoute = '/main/';
        if (currentUrl.startsWith(mainRoute)) {
          App.exitApp();
        } else {
          this._location.back();
        }
      });
    });
  }

  async getUserList() {
    this.loading = true;
    try {
      this._store.dispatch(loadUserList());
      const userList = await this._userSvc.getAffiliateList();
      this.checkPaymentDay(userList);
      this._store.dispatch(loadUserListSuccess({ users: userList }));
      this.loading = false;
    } catch (error) {
      this.isConnected = false;
      this.loading = false;
    }
  }

  async openUserRegistrationModal() {
    const modal = await this._modalCtrl.create({
      component: UserRegistrationModalComponent,
    });

    modal.present();

    modal.onDidDismiss().then(customer => {
      if (!customer.data) return;
      this._store.dispatch(addUser({ user: customer.data }));
      this.lastAddedUserID = customer.data.customerID;
      setTimeout(() => {
        this.lastAddedUserID = null;
      }, 3000)
    })
  }

  addFlicker(userId: string): boolean {
    return this.lastAddedUserID === userId;
  }

  async openAffiliateDetail(info: User) {
    const modal = await this._modalCtrl.create({
      component: UserDetailComponent,
      componentProps: {
        data: info
      }
    });

    modal.present();

    modal.onDidDismiss().then(customer => {      
      const { data, role } = customer;

      if (!data) return;

      this.lastAddedUserID = data;
      setTimeout(() => {
        this.lastAddedUserID = null;
        if(role === 'delete') {
          this._store.dispatch(removeUser({ userId: customer.data }));
        }
      }, 3000)
    })
  }

  checkPaymentDay(userList: any) {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    let membershipStatus = 'Active';
  
    userList.forEach( async (user: any) => {
      const currentMembershipStatus = user.membership.status;

      const expirationDate = new Date(user.membership.expiryDate);
      const expirationDateString = expirationDate.toISOString().split('T')[0];

      if (currentDateString >= expirationDateString || user.membership.status === 'Pending') {
        membershipStatus = 'Pending'
      };

      user.membership.status = membershipStatus;

      if(currentMembershipStatus === 'Active' && membershipStatus === 'Pending') {
        await this._userSvc.updateAffiliate(user);
        this._store.dispatch(updateAffiliateData({ user:user }));
      }

    });
  }


}