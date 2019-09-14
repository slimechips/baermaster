import { Component, OnInit } from '@angular/core';
import {Customer} from '../../RMcomponent/customers/customers.metadata'
import { CustomerService } from 'src/app/service/customer.service';
import { ClientLoginComponent } from 'src/app/pages/customer-login/login.component';
import { ClientComponent } from 'src/app/layouts/client/client.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
    clientData;
    clientDataLoaded: boolean = false;
    join: string;
    constructor(private _customer:CustomerService) {
          // get customer details from the db adn change the profile pic and name accordingly
          ClientLoginComponent.curClientId = ClientLoginComponent.curClientId || 'david123';
          this._customer.getAllCustomerDetails(ClientLoginComponent.curClientId)
              .subscribe((res: any) => {
                  this.clientData = res.customer_dets[ClientLoginComponent.curClientId];
                  console.log(this.clientData)
                  console.log(res)
                  this.clientDataLoaded = true;
              },
              (err: any) => {
                  console.log(err);
              })
    }

  ngOnInit() {
        this.join = '13 Sept 2019';
  }

}
