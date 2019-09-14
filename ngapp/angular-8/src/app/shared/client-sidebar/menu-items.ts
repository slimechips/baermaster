import { RouteInfo } from './client-sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/client/profile',
    title: 'Profile Page',
    icon: 'mdi mdi-file',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'Onboarding',
    icon: '',
    class: '',
    extralink: true,
    submenu: []
  },
  {
    path: '/client/upload',
    title: 'Upload',
    icon: 'mdi mdi-upload',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/client/tutorial',
    title: 'Tutorial',
    icon: 'mdi mdi-school',
    class: '',
    extralink: false,
    submenu: []
  }
];
