import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './client-sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-client-sidebar',
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.css']
})
export class ClientSidebarComponent implements OnInit {
    showMenu = '';
    showSubMenu = '';
    public sidebarnavItems: any[];
    // this is for the open close
    addExpandClass(element: any) {
      if (element === this.showMenu) {
        this.showMenu = '0';
      } else {
        this.showMenu = element;
      }
    }
  
    constructor(
      private modalService: NgbModal,
      private router: Router,
      private route: ActivatedRoute
    ) {}
  
    // End open close
    ngOnInit() {
      this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
    }
}