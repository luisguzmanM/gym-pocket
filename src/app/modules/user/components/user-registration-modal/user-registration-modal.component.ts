import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CameraService } from 'src/app/shared/services/camera.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-registration-modal',
  templateUrl: './user-registration-modal.component.html',
  styleUrls: ['./user-registration-modal.component.scss'],
})
export class UserRegistrationModalComponent  implements OnInit {

  loading: boolean = false;

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    photoURL: new FormControl('', [Validators.required]),
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
    return input.replace(/\b\w/g, char => char.toUpperCase());
  }

  async takePhotoWithCamera() {
    try {
      const photo = await this._cameraSvc.takePicture();
      this.formCtrl.controls['photoURL'].setValue(photo.dataUrl);
    } catch (error) {
      console.log('Error ', error)
    }
  }

  prepareCustomerInfoToSend() {
    this.loading = true;

    const payload = {
      customerID: '',
      firstName: this.formCtrl.controls['firstName'].value,
      lastName: this.formCtrl.controls['lastName'].value,
      dateOfBirth: this.formCtrl.controls['dateOfBirth'].value,
      typeDocIdentity: this.formCtrl.controls['typeDocIdentity'].value,
      docNumber: this.formCtrl.controls['docNumber'].value,
      startDate: this.formCtrl.controls['startDate'].value,
      countryCode: this.formCtrl.controls['countryCode'].value,
      phoneNumber: this.formCtrl.controls['phoneNumber'].value,
      photoURL: this.formCtrl.controls['photoURL'].value,
      isPaymentDue: false,
    }

    this.saveCustomerInfo(payload);
  }

  async saveCustomerInfo(customerInfo:User){
    try {
      const customer = await this._userSvc.insertNewCustomer(customerInfo);
      // TODO-> Guardar la foto con la url correcta luego de registrar al usuario.
      console.log("Document written with ID: ", customer.id);
      this.loading = false;
      this._modalCtrl.dismiss();
    } catch (error) {
      console.log('Error ', error);
    }
  }

}