import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { App } from './app';
import { AuthGuard, GuestGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: Auth,
    canActivate: [GuestGuard]
  },
  {
    path: 'chat',
    component: App,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/chat',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/chat'
  }
];
