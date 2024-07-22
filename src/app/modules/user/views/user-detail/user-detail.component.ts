import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent  implements OnInit {

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

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    isPaymentDue: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    photoURL: new FormControl('', [Validators.required]),
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
  ) { }

  ngOnInit() {
    this.getUser();
  }

  closeUserDetail(): void {
    this._modalCtrl.dismiss();
  }

  async showMoreOptions() {
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
    this.update = true;
    this.title = 'Editando datos';
    this.setInitialUserData();
  }

  async deleteUser() {
    const response = await this._alertSvc.show('Advertencia', '', 'Esta acción no se podrá revertir. ¿Deseas eliminar al usuario?')

    if (response === 'confirm') {
      this.loading = true;
      if('customerID' in this.data){
        const {customerID} = this.data;
        try {
          await this._userSvc.deleteAffiliate(customerID);
          this._modalCtrl.dismiss(customerID);
          this.loading = false;
        } catch (error) {
          this._toastSvc.show('❌ Error al eliminar al cliente');
          this.loading = false;
        }   
      }
    }
  }

  notifyToUser(): void {
    const phone = `${this.data.countryCode}${this.data.phoneNumber}`;
    this.openChatWithNumber(phone);
  }

  openChatWithNumber(phoneNumber: string) {
    const { notificationMessage } = this.user;
    const message: string = notificationMessage;
    console.log(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_system');
  }

  setInitialUserData() {
    this.formCtrl.controls['firstName'].setValue(this.data.firstName);
    this.formCtrl.controls['lastName'].setValue(this.data.lastName);
    this.formCtrl.controls['dateOfBirth'].setValue(this.data.dateOfBirth);
    this.formCtrl.controls['typeDocIdentity'].setValue(this.data.typeDocIdentity);
    this.formCtrl.controls['docNumber'].setValue(this.data.docNumber);
    this.formCtrl.controls['phoneNumber'].setValue(this.data.phoneNumber);
    this.formCtrl.controls['countryCode'].setValue(this.data.countryCode);
    this.formCtrl.controls['isPaymentDue'].setValue(this.data.isPaymentDue);
    this.formCtrl.controls['startDate'].setValue(this.data.startDate);
    this.formCtrl.controls['photoURL'].setValue(this.data.photoURL);
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
      this.formCtrl.controls['photoURL'].setValue(this.customerPhotoDataUpdate);
      const photoUploaded = await this._cameraSvc.uploadPhotoToCloudStorage('customerPhoto' ,this.formCtrl.controls['photoURL'].value);
      const photoURL = await photoUploaded.ref.getDownloadURL();
      this.formCtrl.controls['photoURL'].setValue(photoURL);
      await this._userSvc.updateAffiliate(this.formCtrl.value);

      // Despacha la acción para actualizar el store
      this._store.dispatch(updateAffiliateData({ user: this.formCtrl.value }));
    
      this.loading = false;
      this.enableSaveButton = false;
      this.closeUserDetail();
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
    const isPaymentDue = event === 'overdue' ? true : false;

    this.setInitialUserData();
    this.formCtrl.addControl('customerID', new FormControl(this.data.customerID));
    this.formCtrl.controls['isPaymentDue'].setValue(isPaymentDue);

    let nextPaymentDate: Date;
    if (!isPaymentDue) {
      // Si el pago está al día, sumar un mes a la fecha actual
      nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    } else {
      // Si el pago está atrasado, restar un mes a la fecha de pago actual
      nextPaymentDate = new Date(this.data.startDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() - 1);
    }
  
    this.formCtrl.controls['startDate'].setValue(nextPaymentDate.toISOString().split('T')[0]);

    try {
      await this._userSvc.updateAffiliate(this.formCtrl.value);
      console.log('Con deuda? ', this.formCtrl.controls['isPaymentDue'].value);
      this._store.dispatch(updateAffiliateData({ user: this.formCtrl.value }));
    } catch (error) {
      console.error('❌ Error al actualizar el usuario:', error);
    }
  }

}
