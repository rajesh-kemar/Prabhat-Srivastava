import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginRegisterComponent } from './pages/login-register/login-register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DriversComponent } from './pages/drivers/drivers';
import { VehiclesComponent } from './pages/vehicles/vehicles';
import { TripsComponent } from './pages/trips/trips';
import { UserProfileComponent } from './pages/user-profile/user-profile'; 
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginRegisterComponent },

  // Protected routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['Dispatcher', 'Driver'] } },
  { path: 'drivers', component: DriversComponent, canActivate: [AuthGuard], data: { roles: ['Dispatcher'] } },
  { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuard], data: { roles: ['Dispatcher'] } },
  { path: 'trips', component: TripsComponent, canActivate: [AuthGuard], data: { roles: ['Dispatcher', 'Driver'] } },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard], data: { roles: ['Dispatcher', 'Driver'] } }, 

  // Wildcard fallback
  { path: '**', redirectTo: '/home' }
];
