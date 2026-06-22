import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { ShellComponent } from './components/shell/shell';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { OverviewComponent } from './pages/overview/overview';
import { DelayComponent } from './pages/delay/delay';
import { DepartmentComponent } from './pages/department/department';
import { AnomalyComponent } from './pages/anomaly/anomaly';
import { ReportsComponent } from './pages/reports/reports';
import { AlertsComponent } from './pages/alerts/alerts';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: OverviewComponent },
      { path: 'delay', component: DelayComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'anomaly', component: AnomalyComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'alerts', component: AlertsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
