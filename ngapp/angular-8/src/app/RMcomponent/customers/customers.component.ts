import { Component, OnInit } from '@angular/core';
import { Customer } from './customers.metadata';
import { customers } from './customerList';
import { Router } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { UserLoginComponent } from '../../pages/user-login/login.component';
import { CustomerProfileComponent } from '../customer-profile/customer-profile.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  // read from the database to display the customer information
  customers: object;
  customersArr: Array<Customer> = new Array<Customer>();
  customersLoaded = false;
  constructor( private _router: Router,
    private customerService: CustomerService ) { }

  ngOnInit() {
  if (UserLoginComponent.username === null) { UserLoginComponent.username = 'rahul'; }
  this.customerService.getCustomerDetails(UserLoginComponent.username)
  .subscribe((res: any) => {
    Object.entries(res.customer_dets).forEach(([key, value]: [string, Customer]) => {
      customers[key] = value;
      this.customersArr.push(value);
    });
    console.log(this.customersArr);
    this.customers = customers;
    this.customersLoaded = true;
  });

  }

  more(id: string){
      // route based on the customer name
      console.log(id);
      CustomerProfileComponent.curCustomer = id;
      this._router.navigate(['/rm/customer-profile']);
  }

  upload(){
    this._router.navigate(['/rm/upload']);
  }
}
