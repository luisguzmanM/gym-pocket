import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CameraService } from 'src/app/shared/services/camera.service';
import { CountryService } from 'src/app/shared/services/country.service';
import { CountryModalComponent } from 'src/app/shared/components/country-modal/country-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-panel-update-info',
  templateUrl: './user-panel-update-info.component.html',
  styleUrls: ['./user-panel-update-info.component.scss'],
})
export class UserPanelUpdateInfoComponent  implements OnInit {

  @Input() data!: User;
  @Output() formChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() formValues: EventEmitter<any> = new EventEmitter<any>();
  @Input() loading : boolean = false;
  @Output() customerPhotoEmitter: EventEmitter<string> = new EventEmitter<string>();
  countries: any[] = [];
  disableCountryInput: boolean = false;

  formCtrl: FormGroup = new FormGroup({
    customerID: new FormControl(''),
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
    photoURL: new FormControl('', [Validators.required]),
  });

  customerPhoto: any = null;
  customerPhotoURL: string = '';

  constructor(
    private _cameraSvc: CameraService,
    private _countrySvc: CountryService,
    private _modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.setInitialFormValues();
    this.checkIfThereAreChanges();
    this.getCountries();
  }

  getCountries():void {
    this.disableCountryInput = true;
    this._countrySvc.getCountries().subscribe((data: any[]) => {
      this.countries = data.map(country => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
        flag: country.flags.svg
      }));
      this.countries.sort((a, b) => a.name.localeCompare(b.name));
      this.disableCountryInput = false;
    });
  }

  setInitialFormValues():void {
    this.formCtrl.controls['firstName'].setValue(this.data.firstName);
    this.formCtrl.controls['lastName'].setValue(this.data.lastName);
    this.formCtrl.controls['dateOfBirth'].setValue(this.data.dateOfBirth);
    this.formCtrl.controls['typeDocIdentity'].setValue(this.data.typeDocIdentity);
    this.formCtrl.controls['docNumber'].setValue(this.data.docNumber);
    this.formCtrl.controls['countryCode'].setValue(this.data.countryCode);
    this.formCtrl.controls['phoneNumber'].setValue(this.data.phoneNumber);
    this.formCtrl.controls['photoURL'].setValue(this.data.photoURL);
    this.formCtrl.controls['membershipStatus'].setValue(this.data.membership.status);
    this.formCtrl.controls['membershipExpiryDate'].setValue(this.data.membership.expiryDate);
    this.formCtrl.controls['membershipType'].setValue(this.data.membership.type);

    if('customerID' in this.data){
      this.formCtrl.controls['customerID'].setValue(this.data.customerID);
    }
  }

  checkIfThereAreChanges():void {
    this.formCtrl.valueChanges.subscribe(() => {
      this.formChanged.emit(this.formCtrl.valid);
      this.formValues.emit(this.formCtrl.value);
    });
  }

  async takePhotoWithCamera() {
    try {
      const customerPhoto = await this._cameraSvc.takePicture();
      this.customerPhotoEmitter.emit(customerPhoto)
      this.formCtrl.controls['photoURL'].setValue(customerPhoto.dataUrl);
    } catch (error) {
      console.log('Error ', error)
    }
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

}
