import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CustomerService } from 'src/app/service/customer.service';
import { ClientLoginComponent } from 'src/app/pages/customer-login/login.component';
declare var $: any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
    clientData;
    clientDataLoaded: boolean = false;
    public config: PerfectScrollbarConfigInterface = {};

    constructor(public router: Router,
                private _route: ActivatedRoute,
                private _customer: CustomerService) {
    }
  
    public innerWidth: any;
    public defaultSidebar: any;
    public showMobileMenu = false;
    public expandLogo = false;
    public sidebartype = 'full';
  
    Logo() {
      this.expandLogo = !this.expandLogo;
    }
  
    ngOnInit() {
        if (this.router.url === '/') {
            this.router.navigate(['/profile']);
        }
        this.defaultSidebar = this.sidebartype;
        this.handleSidebar();

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
  
    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.handleSidebar();
    }
  
    handleSidebar() {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1170) {
        this.sidebartype = 'mini-sidebar';
      } else {
        this.sidebartype = this.defaultSidebar;
      }
    }
  
    toggleSidebarType() {
      switch (this.sidebartype) {
        case 'full':
          this.sidebartype = 'mini-sidebar';
          break;
  
        case 'mini-sidebar':
          this.sidebartype = 'full';
          break;
  
        default:
      }
    }

    logOut(){
        this.router.navigate(['client/login'])
    }

}
