import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CameraService } from 'src/app/shared/services/camera.service';
import { UserService } from '../../services/user.service';
import { CountryService } from 'src/app/shared/services/country.service';
import { CountryModalComponent } from 'src/app/shared/components/country-modal/country-modal.component';

@Component({
  selector: 'app-user-registration-modal',
  templateUrl: './user-registration-modal.component.html',
  styleUrls: ['./user-registration-modal.component.scss'],
})
export class UserRegistrationModalComponent  implements OnInit {

  loading: boolean = false;
  customerPhoto: any = {};
  defaultPhotoURL: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  nextPaymentDate: string = this.getFormattedDate();

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    nextPaymentDate: new FormControl(this.nextPaymentDate, Validators.required),
    photoURL: new FormControl('')
  });

  constructor(
    private _modalCtrl: ModalController,
    private _cameraSvc: CameraService,
    private _userSvc: UserService
  ) { }

  ngOnInit() {
    this.capitalizeFormControl('firstName');
    this.capitalizeFormControl('lastName');
  }

  closeModal(): void {
    this._modalCtrl.dismiss();
  }

  capitalizeFormControl(controlName: string) {
    this.formCtrl.get(controlName)?.valueChanges.subscribe(value => {
      const capitalizedValue = this.capitalizeWords(value);
      if (value !== capitalizedValue) {
        this.formCtrl.get(controlName)?.setValue(capitalizedValue, { emitEvent: false });
      }
    });
  }

  capitalizeWords(input: string): string {
    return input.replace(/(^|\s)([a-záéíóúñü])/gi, (match) => match.toUpperCase());
  }

  async takePhotoWithCamera() {
    try {
      this.customerPhoto = await this._cameraSvc.takePicture();
      this.formCtrl.controls['photoURL'].setValue(this.customerPhoto.dataUrl);
    } catch (error) {
      console.log('Error ', error)
    }
  }

  prepareCustomerInfoToSend() {
    const payload = {
      customerID: '',
      firstName: this.formCtrl.controls['firstName'].value,
      lastName: this.formCtrl.controls['lastName'].value,
      dateOfBirth: this.formCtrl.controls['dateOfBirth'].value,
      typeDocIdentity: this.formCtrl.controls['typeDocIdentity'].value,
      docNumber: this.formCtrl.controls['docNumber'].value,
      nextPaymentDate: this.formCtrl.controls['nextPaymentDate'].value,
      countryCode: this.formCtrl.controls['countryCode'].value,
      phoneNumber: this.formCtrl.controls['phoneNumber'].value,
      photoURL: this.formCtrl.controls['photoURL'].value,
      isPaymentDue: false,
    }
    return payload;
  }

  async saveCustomerInfo() {
    this.loading = true;
    try {
      if(this.formCtrl.controls['photoURL'].value !== ''){
        const photoUploaded = await this._cameraSvc.uploadPhotoToCloudStorage('customerPhoto', this.customerPhoto);
        const photoURL = await photoUploaded.ref.getDownloadURL();
        this.formCtrl.controls['photoURL'].setValue(photoURL);
      } else {
        this.formCtrl.controls['photoURL'].setValue(this.defaultPhotoURL);
      }
      const payload = this.prepareCustomerInfoToSend();
      const customer = await this._userSvc.createAffiliate(payload);
      const customerObject = customer.data();
      if(customerObject){
        customerObject['customerID'] = customer.id;
      }
      this.loading = false;
      this._modalCtrl.dismiss(customerObject);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  private getFormattedDate(): string {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
    if (nextMonth.getDate() !== today.getDate()) {
      nextMonth.setDate(0);
    }
  
    const year = nextMonth.getFullYear();
    const month = ('0' + (nextMonth.getMonth() + 1)).slice(-2);
    const day = ('0' + nextMonth.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
  
  async openCountriesModal() {
    const modal = await this._modalCtrl.create({
      component: CountryModalComponent,
    });

    modal.present();

    modal.onDidDismiss().then(country => {
      console.log(country)
    })
  }

}