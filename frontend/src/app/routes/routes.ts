import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth/guard/auth.guard.service';
import { ErrorComponent } from '../pages/error/error.component';
import { LoginComponent } from '../pages/login/screen/login.component';
import { NetworthComponent } from '../pages/networth/screen/networth.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'networth',
    component: NetworthComponent,
    canActivate: [AuthGuard],
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'networth' },
];
