// import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import
{
  CommonModule,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';

import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';


import { Approutes, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UserLoginComponent } from './pages/user-login/login.component';
import { AuthService } from './service/auth.service';
import { UserRegisterComponent } from './pages/user-register/register.component';
import { FullCalendarComponent } from './RMcomponent/full-calendar/full-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { StocksComponent } from './RMcomponent/stocks/stocks.component';
import { ClientLoginComponent } from './pages/customer-login/login.component';
import { ClientRegisterComponent } from './pages/customer-register/register.component';
import { ClientProfileComponent } from './Clientcomponent/profile/profile.component';
import { ClientComponent } from './layouts/client/client.component';
import { ClientSidebarComponent } from './shared/client-sidebar/client-sidebar.component';
import { EditProfileComponent } from './Clientcomponent/edit-profile/edit-profile.component';
import { UploadComponent } from './Clientcomponent/upload/upload.component';
import { TutorialComponent } from './Clientcomponent/tutorial/tutorial.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {HashLocationStrategy} from '@angular/common';
import { RequestUploadComponent } from './RMcomponent/upload/upload.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    BreadcrumbComponent,
    UserLoginComponent,
    UserRegisterComponent,
    routingComponents,
    FullCalendarComponent,
    StocksComponent,
    ClientLoginComponent,
    ClientRegisterComponent,
    ClientProfileComponent,
    ClientComponent,
    ClientSidebarComponent,
    EditProfileComponent,
    UploadComponent,
    TutorialComponent,
    RequestUploadComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(Approutes, { useHash: true }),
    FullCalendarModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
