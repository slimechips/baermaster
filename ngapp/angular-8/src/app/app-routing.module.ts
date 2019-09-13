import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './myComponent/profile/profile.component';
import { CustomersComponent } from './myComponent/customers/customers.component';
import { SuggestedReadingComponent } from './myComponent/suggested-reading/suggested-reading.component';
import { CustomerProfileComponent } from './myComponent/customer-profile/customer-profile.component';
import { FullCalendarComponent } from './myComponent/full-calendar/full-calendar.component';
import { StocksComponent } from './myComponent/stocks/stocks.component'

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile',
        }
      },
      {
        path: 'stocks',
        component: StocksComponent,
        data: {
          title: 'Stocks',
        }
      },
      {
        path: 'customers',
        component: CustomersComponent,
        data: {
          title: 'Customer List',
        }
      },
      {
        path: 'suggestedreading',
        component: SuggestedReadingComponent,
        data: {
          title: 'Suggested Readings',
        }
      },
      {
        path: 'customer-profile',
        component: CustomerProfileComponent,
        data: {
          title: 'Customer Profile',
        }
      },
      {
        path: 'full-calendar',
        component: FullCalendarComponent,
        data: {
          title: 'Calendar',
        }
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  },

];

export const routingComponents = [ProfileComponent, CustomersComponent, SuggestedReadingComponent, CustomerProfileComponent];
