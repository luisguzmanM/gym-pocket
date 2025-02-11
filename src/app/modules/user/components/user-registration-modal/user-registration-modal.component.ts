import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CameraService } from 'src/app/shared/services/camera.service';
import { UserService } from '../../services/user.service';
import { CountryModalComponent } from 'src/app/shared/components/country-modal/country-modal.component';
import { MembershipType, User } from '../../models/user.model';

@Component({
  selector: 'app-user-registration-modal',
  templateUrl: './user-registration-modal.component.html',
  styleUrls: ['./user-registration-modal.component.scss'],
})
export class UserRegistrationModalComponent  implements OnInit {

  loading: boolean = false;
  customerPhoto: any = {};
  defaultPhotoURL: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  membershipTypes:MembershipType[] = [
    {
      type: 'O',
      description: 'Ocasional',
    },
    {
      type: 'M',
      description: 'Mensual',
    },
    {
      type: 'Q',
      description: 'Trimestral',
    },
    {
      type: 'S',
      description: 'Semestral',
    },
    {
      type: 'A',
      description: 'Anual',
    },
  ];

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    membershipType: new FormControl('', Validators.required),
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
    const payload:User = {
      customerID: '',
      firstName: this.formCtrl.controls['firstName'].value,
      lastName: this.formCtrl.controls['lastName'].value,
      dateOfBirth: this.formCtrl.controls['dateOfBirth'].value,
      typeDocIdentity: this.formCtrl.controls['typeDocIdentity'].value,
      docNumber: this.formCtrl.controls['docNumber'].value,
      countryCode: this.formCtrl.controls['countryCode'].value,
      phoneNumber: this.formCtrl.controls['phoneNumber'].value,
      membership: {
        type: this.formCtrl.controls['membershipType'].value,
        startDate: this.setStartDate(),
        expiryDate: this.setNextPaymentDate(),
        status: 'Active'
      },
      photoURL: this.formCtrl.controls['photoURL'].value
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
      console.log('customerID -> ', customerObject);
      if(customerObject) customerObject['customerID'] = customer.id;

      this.loading = false;
      this._modalCtrl.dismiss(customerObject);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  setNextPaymentDate(): string {
    const today = new Date();
    let nextPaymentMonth = 0;

    if (this.formCtrl.controls['membershipType'].value === 'M') {
      nextPaymentMonth = 1;
    } else if (this.formCtrl.controls['membershipType'].value === 'Q') {
      nextPaymentMonth = 3;
    } else if (this.formCtrl.controls['membershipType'].value === 'S') {
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

  setStartDate():string {
    const today = new Date;
    const startDate = new Date(today);

    const year = startDate.getFullYear();
    const month = ('0' + (startDate.getMonth() + 1)).slice(-2);
    const day = ('0' + startDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  async openCountriesModal() {
    const modal = await this._modalCtrl.create({
      component: CountryModalComponent,
    });

    modal.present();

    modal.onDidDismiss().then(country => {
      this.formCtrl.controls['countryCode'].setValue(country.data.code);
    })
  }

  selectMembershipType(event:any){
    this.formCtrl.controls['membershipType'].setValue(event.target.value);
  }

}