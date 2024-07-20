import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-panel-info',
  templateUrl: './user-panel-info.component.html',
  styleUrls: ['./user-panel-info.component.scss'],
})
export class UserPanelInfoComponent  implements OnInit {

  @Input() data!: User;
  @Output() membershipStateEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {}

  onRadioChange(event:any){
    this.membershipStateEmitter.emit(event.target.value);
  }

}
