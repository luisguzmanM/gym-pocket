import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-panel-info',
  templateUrl: './user-panel-info.component.html',
  styleUrls: ['./user-panel-info.component.scss'],
})
export class UserPanelInfoComponent  implements OnInit {

  @Input() data!: User;

  constructor() { }

  ngOnInit(): void {}

  onRadioChange(event:any){
    console.log(event.target.value)
  }

}
