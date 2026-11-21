import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(({ RegisterComponent }) => RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then(({ DASHBOARD_ROUTES }) => DASHBOARD_ROUTES)
  },
  { path: '**', redirectTo: 'dashboard' }
];
