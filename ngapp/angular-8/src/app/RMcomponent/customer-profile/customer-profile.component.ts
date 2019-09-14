import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from '../../RMcomponent/customers/customers.metadata';
import { customers } from '../customers/customerList';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
    static curCustomer: string;
    curCustomerData: Customer;

    constructor(
        private _customer: CustomerService,
        private _router: Router
        ) {
            CustomerProfileComponent.curCustomer =
                CustomerProfileComponent.curCustomer || 'David';
            this.curCustomerData =
                customers[CustomerProfileComponent.curCustomer] || {};
         }

    ngOnInit() {
    }

    save(f: NgForm) {
        customers[CustomerProfileComponent.curCustomer] = { ...f.value };
        console.log(f.value)
        this._customer.postCustomerDetails(CustomerProfileComponent.curCustomer,
            { details: customers[CustomerProfileComponent.curCustomer] })
        .subscribe(
            res => {
                if (res.msg === 'Response Succeeded') {
                    console.log(res.msg);
                    this._router.navigate(['/rm/customers'])
                } else {
                    console.error('Post Customer Details Failed');
                }
            } ,
            err => console.log(err)
        )
    }
}
