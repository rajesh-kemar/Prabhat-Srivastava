import { Routes } from '@angular/router';
import { DriversComponent } from './pages/drivers/drivers';
import { VehiclesComponent } from './pages/vehicles/vehicles';
import { TripsComponent } from './pages/trips/trips';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'drivers', component: DriversComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'dashboard', component: DashboardComponent },
];