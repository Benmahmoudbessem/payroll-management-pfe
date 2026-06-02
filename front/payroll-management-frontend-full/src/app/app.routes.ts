import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/login-page.component';
import { ShellComponent } from './layout/shell.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { DepartmentsPageComponent } from './features/departments/departments-page.component';
import { EmployeesPageComponent } from './features/employees/employees-page.component';
import { ContractsPageComponent } from './features/contracts/contracts-page.component';
import { LeaveRequestsPageComponent } from './features/leaves/leave-requests-page.component';
import { PayrollsPageComponent } from './features/payrolls/payrolls-page.component';
import { PredictionsPageComponent } from './features/predictions/predictions-page.component';
import { NotificationsPageComponent } from './features/notifications/notifications-page.component';
import { UsersPageComponent } from './features/users/users-page.component';
import { EmployeeSpacePageComponent } from './features/employee-space/employee-space-page.component';
import { AnomaliesPageComponent } from './features/anomalies/anomalies-page.component';
export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'departments', component: DepartmentsPageComponent },
      { path: 'employees', component: EmployeesPageComponent },
      { path: 'contracts', component: ContractsPageComponent },
      { path: 'leave-requests', component: LeaveRequestsPageComponent },
      { path: 'payrolls', component: PayrollsPageComponent },
      { path: 'predictions', component: PredictionsPageComponent },
      { path: 'notifications', component: NotificationsPageComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'employee-space', component: EmployeeSpacePageComponent },
      { path: 'anomalies', component: AnomaliesPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
