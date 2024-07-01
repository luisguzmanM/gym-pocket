import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';

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
  @Input() loadingText : string = '';

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    typeDocIdentity: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    photoURL: new FormControl('', [Validators.required]),
    customerID: new FormControl('', Validators.required)  
  });

  constructor(
    private _userSvc: UserService,
    private _toastSvc: ToastService
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
    this.formCtrl.controls['startDate'].setValue(this.data.startDate);
    this.formCtrl.controls['photoURL'].setValue(this.data.photoURL);

    if('id' in this.data){
      this.formCtrl.controls['id'].setValue(this.data.id);
    }
  }

  checkIfThereAreChanges():void {
    this.formCtrl.valueChanges.subscribe(() => {
      this.formChanged.emit(this.formCtrl.valid);
      this.formValues.emit(this.formCtrl.value);
    });
  }

  async changeUserPhoto() {
    // try {
    //   const result = await this._userSvc.takePicture('Foto del usuario');
    //   if (result && 'dataUrl' in result) {
    //     this.loading = true;
    //     this.loadingText = 'Actualizando foto...';

    //     // Obtener la URL de la imagen anterior
    //     const oldPhotoUrl = this.formCtrl.controls['photo'].value;

    //     // Eliminar la imagen anterior si existe
    //     if (oldPhotoUrl) {
    //       await this._userSvc.deleteImageFromFirebase(oldPhotoUrl);
    //     }

    //     const photoPath = await this._userSvc.uploadImageToFirebase(result);
    //     this.formCtrl.controls['photo'].setValue(photoPath);

    //     this.loading = false;
    //     this.loadingText = '';        
    //   }
    // } catch (error) {
    //   console.error('Error al capturar la foto:', error);
    //   this._toastSvc.show('Hubo un error al actualizr la foto. Comunícate con el administrador de la app.');
    // }
  }

}
