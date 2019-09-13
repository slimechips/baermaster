import { Component, AfterViewInit,OnInit } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';
@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit,AfterViewInit {
  /* 
  retrieve data from the database
  profile_picture:
  name:
  DOB:
  email:
  join:
 
  */
  subtitle: string;
  profileName: string;
  profileDescrip: string;
  email: string;
  jobs: string;
  join: string;
  constructor() {
    this.subtitle = 'This is some text within a card block.';
    this.profileName = 'Rahul B';
    this.profileDescrip = 'Always ready for a challenging customer';
    this.email = 'rahul@barMaster.com';
    this.join = '13 Sept 2019';
    this.jobs = 'Professional Consultant';
  }
  ngOnInit(){
    // initialize person's object
  }
  ngAfterViewInit() {}
}
