import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { AdMobService } from './shared/services/ad-mob.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(
    private _themeSvc: ThemeService,
    private _adMobSvc: AdMobService
  ) {
    this._themeSvc.setInitialTheme();
    this._adMobSvc.initializeAds();
  }

}