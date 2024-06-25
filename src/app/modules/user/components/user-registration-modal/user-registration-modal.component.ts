import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-registration-modal',
  templateUrl: './user-registration-modal.component.html',
  styleUrls: ['./user-registration-modal.component.scss'],
})
export class UserRegistrationModalComponent  implements OnInit {

  loading: boolean = false;
  loadingText:string = '';

  formCtrl: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    docType: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    photo: new FormControl('', [Validators.required]),
  });

  constructor(
    private _modalCtrl: ModalController,
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

}
