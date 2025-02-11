import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UserService } from '../../services/user.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { updateAffiliateData } from 'src/app/state/actions/user.actions';
import { CameraService } from 'src/app/shared/services/camera.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AdMobService } from 'src/app/shared/services/ad-mob.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent  implements OnInit, OnDestroy {

  @Input() data!: User;
  update: boolean = false;
  title: string = 'Detalle del usuario';
  loading: boolean = false;
  loadingText: string = '';
  enableSaveButton: boolean = false;
  customerPhotoDataUpdate: any = {};

  // Gym
  userID: any = null;
  user: any = {};

  previousPhotoURL: string = '';

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    membershipStatus: new FormControl('', Validators.required),
    membershipType: new FormControl('', Validators.required),
    membershipExpiryDate: new FormControl('', Validators.required),
    photoURL: new FormControl('', [Validators.required])
  });

  constructor(
    private _modalCtrl: ModalController,
    private _actionSheetCtrl: ActionSheetController,
    private _alertSvc: AlertService,
    private _userSvc: UserService,
    private _store: Store<AppState>,
    private _cameraSvc: CameraService,
    private _authSvc: AuthService,
    private _toastSvc: ToastService,
    private _adMobSvc: AdMobService
  ) { }

  ngOnInit() {
    this.getUser();
    this.previousPhotoURL = this.data.photoURL;
    if(this._adMobSvc.bannerStarted === false) this._adMobSvc.showAdsBanner();
    if(this._adMobSvc.bannerStarted === true) this._adMobSvc.showAdsBannerAgain();
  }

  ngOnDestroy() {
    this._adMobSvc.hideAdsBanner();
  }

  setInitialUserData() {
    this.formCtrl.controls['firstName'].setValue(this.data.firstName);
    this.formCtrl.controls['lastName'].setValue(this.data.lastName);
    this.formCtrl.controls['dateOfBirth'].setValue(this.data.dateOfBirth);
    this.formCtrl.controls['typeDocIdentity'].setValue(this.data.typeDocIdentity);
    this.formCtrl.controls['docNumber'].setValue(this.data.docNumber);
    this.formCtrl.controls['countryCode'].setValue(this.data.countryCode);
    this.formCtrl.controls['phoneNumber'].setValue(this.data.phoneNumber);
    this.formCtrl.controls['membershipStatus'].setValue(this.data.membership.status);
    this.formCtrl.controls['membershipExpiryDate'].setValue(this.data.membership.expiryDate);
    this.formCtrl.controls['membershipType'].setValue(this.data.membership.type);
    this.formCtrl.controls['photoURL'].setValue(this.data.photoURL);
  }

  closeUserDetail(): void {
    this._modalCtrl.dismiss();
  }

  async showMoreOptions() {
    this._adMobSvc.hideAdsBanner();

    const actionSheet = await this._actionSheetCtrl.create({
      header: 'Más opciones',
      buttons: [
        {
          text: 'Actualizar datos del usuario',
          icon: 'person-outline',
          handler: () => this.updateUserData()
        },
        {
          text: 'Notificar a usuario',
          icon: 'notifications-outline',
          handler: () => this.notifyToUser()
        },
        {
          text: 'Eliminar usuario',
          icon: 'trash-outline',
          handler: () => this.deleteUser()
        },
      ],
    });

    await actionSheet.present();
  }

  updateUserData(): void {
    this._adMobSvc.showAdsBannerAgain();
    this.update = true;
    this.title = 'Editando datos';
    this.setInitialUserData();
  }

  async deleteUser() {
    this._adMobSvc.showAdsBannerAgain();
    const response = await this._alertSvc.show('Advertencia', '', 'Esta acción no se podrá revertir. ¿Deseas eliminar al usuario?')

    if (response === 'confirm') {
      this.loading = true;
      if('customerID' in this.data){
        const {customerID} = this.data;
        try {
          await this._userSvc.deleteAffiliate(customerID);
          this._modalCtrl.dismiss(customerID, 'delete');
          this.loading = false;
        } catch (error) {
          this._toastSvc.show('❌ Error al eliminar al cliente');
          this.loading = false;
        }   
      }
    }
  }

  notifyToUser(): void {
    this._adMobSvc.showAdsBannerAgain();
    const phone = `${this.data.countryCode}${this.data.phoneNumber}`;
    this.openChatWithNumber(phone);
  }

  openChatWithNumber(phoneNumber: string) {
    const { notificationMessage } = this.user;
    const message: string = notificationMessage;    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_system');
  }

  areThereChangesInUpdateForm(event: boolean):void {
    event ? this.enableSaveButton = true : this.enableSaveButton = false;
  }

  getNewFormValues(event: User):void {
    this.formCtrl.addControl('customerID', new FormControl(event.customerID));
    this.formCtrl.setValue(event);
  }

  async updateUserDetails(): Promise<void> {
    this.loading = true;
    try {

      if(this.previousPhotoURL !== this.formCtrl.controls['photoURL'].value){
        this.formCtrl.controls['photoURL'].setValue(this.customerPhotoDataUpdate);
        const photoUploaded = await this._cameraSvc.uploadPhotoToCloudStorage('customerPhoto' ,this.formCtrl.controls['photoURL'].value);
        const photoURL = await photoUploaded.ref.getDownloadURL();
        this.formCtrl.controls['photoURL'].setValue(photoURL);
      }

      const payload = this.prepareCustomerInfoToSend();

      await this._userSvc.updateAffiliate(payload);
      this._store.dispatch(updateAffiliateData({ user: payload }));
    
      this.loading = false;
      this.enableSaveButton = false;
      this._modalCtrl.dismiss(payload.customerID, 'update');
    } catch (error) {
      console.error('❌ Error al actualizar el usuario:', error);
      this.loading = false;
    }
  }

  showLoading(event:any){
    this.loading = event;
  }

  setUpdateCustomerPhoto(event: any){
    this.customerPhotoDataUpdate = event;
  }

  getUser(): void {
    this.loading = true;
    this._authSvc.getUser().subscribe(user => {
      this.userID = user?.uid;
      if(this.userID != null){
        this.getUserData();
      }
    });
  }

  getUserData(){
    this._authSvc.getUserData(this.userID).subscribe(data => {
      this.user = data;
      this.loading = false;
    })
  }

  async changeMembershipState(event:string){
    this.setInitialUserData();
    const nextPaymentDate = this.setNextPaymentDate();

    this.formCtrl.addControl('customerID', new FormControl(this.data.customerID));
    this.formCtrl.controls['membershipStatus'].setValue(event);
    this.formCtrl.controls['membershipExpiryDate'].setValue(nextPaymentDate);

    const payload = this.prepareCustomerInfoToSend();

    try {
      await this._userSvc.updateAffiliate(payload);
      this._store.dispatch(updateAffiliateData({ user: payload }));
    } catch (error) {
      console.error('❌ Error al actualizar el usuario:', error);
      this._toastSvc.show('Error al cambiar estado de pago');
    }
  }

  prepareCustomerInfoToSend() {
    const payload:User = {
      customerID: this.formCtrl.controls['customerID'].value,
      firstName: this.formCtrl.controls['firstName'].value,
      lastName: this.formCtrl.controls['lastName'].value,
      dateOfBirth: this.formCtrl.controls['dateOfBirth'].value,
      typeDocIdentity: this.formCtrl.controls['typeDocIdentity'].value,
      docNumber: this.formCtrl.controls['docNumber'].value,
      countryCode: this.formCtrl.controls['countryCode'].value,
      phoneNumber: this.formCtrl.controls['phoneNumber'].value,
      membership: {
        type: this.formCtrl.controls['membershipType'].value,
        startDate: this.data.membership.startDate,
        expiryDate: this.formCtrl.controls['membershipExpiryDate'].value,
        status: this.formCtrl.controls['membershipStatus'].value
      },
      photoURL: this.formCtrl.controls['photoURL'].value
    }
    return payload;
  }

  setNextPaymentDate():string {
    const today = new Date();
    let nextPaymentMonth = 0;

    if (this.data.membership.type === 'M') {
      nextPaymentMonth = 1;
    } else if (this.data.membership.type === 'Q') {
      nextPaymentMonth = 3;
    } else if (this.data.membership.type === 'S') {
      nextPaymentMonth = 6;
    } else {
      nextPaymentMonth = 12;
    }

    const nextPaymentDate = new Date(today);
    nextPaymentDate.setMonth(today.getMonth() + nextPaymentMonth);

    const year = nextPaymentDate.getFullYear();
    const month = ('0' + (nextPaymentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + nextPaymentDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

}
