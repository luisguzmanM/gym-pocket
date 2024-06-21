import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class PhotoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
