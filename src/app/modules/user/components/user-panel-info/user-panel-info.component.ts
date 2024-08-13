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
  membershipStatus:string = '';

  constructor() { }

  ngOnInit(): void {
    this.membershipStatus = this.data.membership.status;
  }

  onRadioChange(event:any){
    this.membershipStateEmitter.emit(event.target.value);
    this.membershipStatus = event.target.value;
  }

  getFormattedDisplayDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  getMembershipType():string {
    const type = this.data.membership.type;
    let membershipType = '';

    if(type === 'O') membershipType = 'Ocasional';
    if(type === 'M') membershipType = 'Mensual';
    if(type === 'Q') membershipType = 'Trimestral';
    if(type === 'S') membershipType = 'Semestral';
    if(type === 'A') membershipType = 'Anual';

    return membershipType;
  }

}
