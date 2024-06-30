import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {

  empezarButtonText: string = 'Empezar';

  constructor(
    private _navCtrl: NavController,
    private _authSvc: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {}

  comenzar(): void {
    this._authSvc.getUser().subscribe(user => {
      if (user) {
        this._router.navigate(['/main']);
      } else {
        this._navCtrl.navigateForward('auth');
      }
    });
  }

}
