// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/leave-manager/components/dashboard/dashboard.component';

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
        loadComponent: () =>
          import('./features/leave-manager/components/calendar/calendar.component')
            .then(m => m.CalendarComponent)
      },
      {
        path: 'request',
        loadComponent: () =>
          import('./features/leave-manager/components/request-form/request-form.component')
            .then(m => m.RequestFormComponent)
      }
    ]
  }
];