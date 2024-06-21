import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {

  empezarButtonText: string = 'Empezar';

  constructor(
    private _navCtrl: NavController
  ) { }

  ngOnInit() {}

  comenzar(): void {
    this._navCtrl.navigateForward('auth');
  }

}
