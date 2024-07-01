import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-panel-info',
  templateUrl: './user-panel-info.component.html',
  styleUrls: ['./user-panel-info.component.scss'],
})
export class UserPanelInfoComponent  implements OnInit {

  @Input() data!: User;
  toggleState!: boolean;

  constructor(
    private _userSvc: UserService
  ) { }

  ngOnInit(): void {
    this.toggleState = this.data.isPaymentDue;
  }

  async changePaymentState(){
    let { customerID, isPaymentDue } = this.data;
    isPaymentDue === true ? isPaymentDue = false : isPaymentDue = true;
    try {
      if('id' in this.data){
        // await this._userSvc.updateUserPaymentStatus(id, isPaymentDue);
      }
    } catch (error) {
      throw error;
    }
  }

}
