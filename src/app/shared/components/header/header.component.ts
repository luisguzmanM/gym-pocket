import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
  ]
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() showBackButton: boolean = false;
  @Input() showAuxiliaryButton: boolean = false;
  @Input() auxiliaryButtonIconName!: string;

  @Output() backButtonEmitter = new EventEmitter();
  @Output() auxiliaryButtonEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  handleBackButton():void {
    this.backButtonEmitter.emit(true);
  }

  handleAuxiliaryButton():void {
    this.auxiliaryButtonEmitter.emit(true);
  }

}