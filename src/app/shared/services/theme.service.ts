import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkMode = new BehaviorSubject(false);

  constructor() { }

  setTheme(darkMode:boolean){
    console.log('service setting theme dark ', darkMode)
    if(darkMode){
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }

    this.darkMode.next(darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }

  setInitialTheme(){
    let darkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');

    if(darkMode){
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }

    this.darkMode.next(darkMode);
  }
}
