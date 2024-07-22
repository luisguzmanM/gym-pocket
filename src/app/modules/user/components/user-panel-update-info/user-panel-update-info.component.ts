import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CameraService } from 'src/app/shared/services/camera.service';

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

  formCtrl: FormGroup = new FormGroup({
    customerID: new FormControl(''),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    nextPaymentDate: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    photoURL: new FormControl('', [Validators.required]),
    isPaymentDue: new FormControl('')
  });

  customerPhoto: any = null;
  customerPhotoURL: string = '';

  constructor(
    private _cameraSvc: CameraService,
  ) {}

  ngOnInit() {
    this.setInitialFormValues();
    this.checkIfThereAreChanges();
  }

  setInitialFormValues():void {
    this.formCtrl.controls['firstName'].setValue(this.data.firstName);
    this.formCtrl.controls['lastName'].setValue(this.data.lastName);
    this.formCtrl.controls['dateOfBirth'].setValue(this.data.dateOfBirth);
    this.formCtrl.controls['typeDocIdentity'].setValue(this.data.typeDocIdentity);
    this.formCtrl.controls['docNumber'].setValue(this.data.docNumber);
    this.formCtrl.controls['countryCode'].setValue(this.data.countryCode);
    this.formCtrl.controls['phoneNumber'].setValue(this.data.phoneNumber);
    this.formCtrl.controls['nextPaymentDate'].setValue(this.data.nextPaymentDate);
    this.formCtrl.controls['photoURL'].setValue(this.data.photoURL);
    this.formCtrl.controls['isPaymentDue'].setValue(this.data.isPaymentDue);

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

}
