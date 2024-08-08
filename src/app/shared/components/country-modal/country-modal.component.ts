import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ]
})
export class CountryModalComponent implements OnInit {

  countries: any[] = [];
  filteredCountries: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  constructor(
    private modalController: ModalController,
    private _countrySvc: CountryService
  ) {}

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.loading = true;
    this._countrySvc.getCountries().subscribe((data: any[]) => {
      this.countries = data.map(country => ({
        name: country.name.common,
        code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
        flag: country.flags.svg
      }));
      this.countries.sort((a, b) => a.name.localeCompare(b.name));
      this.filteredCountries = [...this.countries];
      this.loading = false;
    });
  }

  filterCountries() {
    const term = this.searchTerm.toLowerCase();
    if (term) {
      this.filteredCountries = this.countries.filter(
        (country) =>
          country.name.toLowerCase().includes(term) ||
          country.code.includes(term)
      );
    } else {
      this.filteredCountries = [...this.countries];
    }
  }

  selectCountry(country: any) {
    this.modalController.dismiss(country);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
