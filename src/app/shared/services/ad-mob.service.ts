import { Injectable } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';
import { BannerAdOptions, BannerAdPluginEvents, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {

  constructor() {
    this.initializeAds();
  }

  async initializeAds() {
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: false
      });
    } catch (error) {
      console.log('Error en inicialización de ads');
    }
  }

  async showAdsBanner() {
    try {
      const options : BannerAdOptions = {
        adId: 'ca-app-pub-6002124924052842/8841520926',
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        isTesting: true
      };

      await AdMob.showBanner(options).then(() => console.log('✅ Banner Okay!!!'));

      // Errores que se mostrarán en la consola de android studios
      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
        console.log(error.code);
        console.log(error.message);
      })

    } catch (error) {
      console.log('Error al mostrar el banner -> ', error);
    }
  }

  async hideAdsBanner(){
    await AdMob.hideBanner();
  }
}
