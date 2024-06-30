import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectLoading, selectUsers } from 'src/app/state/selectors/user.selectors';
import { UserService } from '../../services/user.service';
import { addUser, loadUserList, loadUserListSuccess } from 'src/app/state/actions/user.actions';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { UserRegistrationModalComponent } from '../../components/user-registration-modal/user-registration-modal.component';

import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  userList$: Observable<User[]> = this._store.select((selectUsers));
  loading$: Observable<boolean> = this._store.select((selectLoading));
  lastAddedUserID: string | null = null;
  isConnected:boolean = true;

  constructor(
    private _store: Store<AppState>,
    private _userSvc: UserService,
    private _modalCtrl: ModalController,
    private _platform: Platform,
    private _location: Location,
    private _router: Router
  ) { }

  ngOnInit() {
    this.checkNetworkStatus();
    this.initializeApp();
    this.getUserList();
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
    try {
      this._store.dispatch(loadUserList());
      const userList = await this._userSvc.getAffiliateList(); // Get clients from database.
      this._store.dispatch(loadUserListSuccess({users: userList})); // Save clients inside store.
    } catch (error) {
      this.isConnected = false;
    }
  }

  async openUserRegistrationModal() {
    const modal = await this._modalCtrl.create({
      component: UserRegistrationModalComponent,
    });

    modal.present();

    modal.onDidDismiss().then(customer => {
      if(!customer.data) return;
      this._store.dispatch(addUser({ user: customer.data }));
      this.lastAddedUserID = customer.data.customerID;
      setTimeout(() => {
        this.lastAddedUserID = null;
      }, 3000)
    })
  }

  isLastAddedUser(userId: string): boolean {
    return this.lastAddedUserID === userId;
  }

  @HostListener('window:online', ['$event'])
  onOnline(event: Event) {
    console.log('Network connected!');
    this.isConnected = true;
    this.getUserList();
  }

  @HostListener('window:offline', ['$event'])
  onOffline(event: Event) {
    console.log('Network was disconnected :-(');
    this.isConnected = false;
  }

  checkNetworkStatus() {
    this.isConnected = navigator.onLine;
  }

}