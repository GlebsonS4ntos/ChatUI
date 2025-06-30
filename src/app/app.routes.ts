import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { App } from './app';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: Auth
  },
  {
    path: 'chat',
    component: App,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full'
  }
];

