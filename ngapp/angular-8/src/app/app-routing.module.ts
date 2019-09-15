import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { UserLoginComponent } from './pages/user-login/login.component';
import { UserRegisterComponent } from './pages/user-register/register.component';
import { ProfileComponent } from './RMcomponent/profile/profile.component';
import { CustomersComponent } from './RMcomponent/customers/customers.component';
import { SuggestedReadingComponent } from './RMcomponent/suggested-reading/suggested-reading.component';
import { CustomerProfileComponent } from './RMcomponent/customer-profile/customer-profile.component';
import { FullCalendarComponent } from './RMcomponent/full-calendar/full-calendar.component';
import { StocksComponent } from './RMcomponent/stocks/stocks.component'
import { ClientLoginComponent } from './pages/customer-login/login.component';
import { ClientRegisterComponent } from './pages/customer-register/register.component';
import { ClientProfileComponent } from './Clientcomponent/profile/profile.component';
import { ClientComponent } from './layouts/client/client.component';
import { UploadComponent } from './Clientcomponent/upload/upload.component';
import { TutorialComponent } from './Clientcomponent/tutorial/tutorial.component';
import { RequestUploadComponent } from './RMcomponent/upload/upload.component';

export const Approutes: Routes = [
  {
    path: 'rm',
    children: [{ path: '', redirectTo: '/rm/login', pathMatch: 'full' },
    {
        path: 'login',
        component: UserLoginComponent
    },
    {
        path: 'register',
        component: UserRegisterComponent
    },
    {
        path: '',
        component: FullComponent,
        children: [
            { path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile',
        }
      },
      {
        path: 'upload',
        component: RequestUploadComponent,
        data: {
            title: 'Onboarding',
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
        }]
    }]
  },
  {
    path: 'client',
    children: [{ path: '', redirectTo: '/client/login', pathMatch: 'full' },
    {
        path: 'login',
        component: ClientLoginComponent
    },
    {
        path: 'register',
        component: ClientRegisterComponent
    },
    {
        path: '',
        component: ClientComponent,
        children: [{
            path: 'profile',
            component: ClientProfileComponent,
            data: {
                title: 'Profile',
              }
        },
        {
            path: 'upload',
            component: UploadComponent,
            data: {
                title: 'Upload your document to onboard',
              }
        },
        {
            path: 'tutorial',
            component: TutorialComponent,
            data: {
                title: 'Tutorial sections',
              }
        }
    ]
    }]
  },
  {
        path: '',
        component: FullComponent,
        children: [{
            path: 'component',
            loadChildren: './component/component.module#ComponentsModule'
      }]
  },
  {
    path: '**',
    redirectTo: '/rm/login',
    pathMatch: 'full'
  }
];

export const routingComponents = [ProfileComponent, CustomersComponent, SuggestedReadingComponent, CustomerProfileComponent];
