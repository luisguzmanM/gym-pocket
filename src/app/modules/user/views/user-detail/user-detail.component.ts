import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UserService } from '../../services/user.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLoading, selectUsers } from 'src/app/state/selectors/user.selectors';
import { AppState } from 'src/app/state/app.state';
import { removeUser, updateAffiliateData } from 'src/app/state/actions/user.actions';
import { CameraService } from 'src/app/shared/services/camera.service';

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

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    photoURL: new FormControl('', [Validators.required]),
  });

  constructor(
    private _modalCtrl: ModalController,
    private _actionSheetCtrl: ActionSheetController,
    private _alertSvc: AlertService,
    private _platform: Platform,
    private _userSvc: UserService,
    private _store: Store<AppState>,
    private _cameraSvc: CameraService
  ) { }

  ngOnInit() { }

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
          console.error('Error al eliminar el usuario:', error);
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
    const message: string = 'Estimado usuario, tu gimnasio te notifica que tu mensualidad ha vencido. Por favor acércate al counter de nuestra sede para regularizar tu mensualidad.';
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
      const photoUploaded = await this._cameraSvc.uploadPhotoToCloudStorage(this.formCtrl.controls['photoURL'].value);
      const photoURL = await photoUploaded.ref.getDownloadURL();
      this.formCtrl.controls['photoURL'].setValue(photoURL);
      await this._userSvc.updateAffiliate(this.formCtrl.value);

      // Despacha la acción para actualizar el store
      this._store.dispatch(updateAffiliateData({ user: this.formCtrl.value }));
    
      this.loading = false;
      this.enableSaveButton = false;
      this.closeUserDetail();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      this.loading = false;
    }
  }

  showLoading(event:any){
    this.loading = event;
  }

  setUpdateCustomerPhoto(event: any){
    this.customerPhotoDataUpdate = event;
    console.log(this.customerPhotoDataUpdate)
  }

}
