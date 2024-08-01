import { Injectable } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';
import { BannerAdOptions, BannerAdPluginEvents, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {

  bannerStarted: boolean = false;

  constructor() {
    this.initializeAds();
  }

  async initializeAds() {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: false
    });
  }

  async showAdsBanner() {
    const options : BannerAdOptions = {
      adId: 'ca-app-pub-6002124924052842/8841520926',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting: true,
    };

    await AdMob.showBanner(options).then(() => this.bannerStarted = true);
  }

  async hideAdsBanner(){
    await AdMob.hideBanner();
  }

  async showAdsBannerAgain() {
    await AdMob.resumeBanner();
  }
}
