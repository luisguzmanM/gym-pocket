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
  isPaymentDue: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(this.data){
      this.isPaymentDue = this.data.isPaymentDue
    }
  }

  onRadioChange(event:any){
    if(event.target.value === 'overdue') this.isPaymentDue = true;
    if(event.target.value === 'paid') this.isPaymentDue = false;
    this.membershipStateEmitter.emit(event.target.value);
  }

  // Método para convertir fecha de YYYY-MM-DD a DD-MM-YYYY
  getFormattedDisplayDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

}
