import { Component, HostListener, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent  implements OnInit {

  isConnected: boolean = true;

  constructor(
    private _connectionSvc: ConnectionService
  ) { }

  ngOnInit() {
    this._connectionSvc.getNetworkConnection().subscribe(res => {
      console.log('¿Está conectado?', res);
      if(res) this.onOnline;
      if(!res) this.onOffline;
      this.isConnected = res;
    });
  }

  @HostListener('window:online', ['$event'])
  onOnline() {
    this._connectionSvc.setNetworkConnection(true);
  }

  @HostListener('window:offline', ['$event'])
  onOffline() {
    this._connectionSvc.setNetworkConnection(false);
  }

}
