// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/leave-manager/components/dashboard/dashboard.component';
import { requireProfileGuard } from './core/guards/require-profile.guard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full'
      },
      {
        path: 'calendar',
        canActivate: [requireProfileGuard],
        loadComponent: () =>
          import('./features/calendar/components/calendar/calendar.component')
            .then(m => m.CalendarComponent)
      },
      {
        path: 'request',
        canActivate: [requireProfileGuard],
        loadComponent: () =>
          import('./features/leave-manager/components/request-form/request-form.component')
            .then(m => m.RequestFormComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/employee-config/components/user-profile/user-profile.component')
            .then(m => m.UserProfileComponent)
      }
    ]
  }
];