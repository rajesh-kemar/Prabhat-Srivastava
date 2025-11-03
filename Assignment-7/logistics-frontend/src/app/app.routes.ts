import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DriversComponent } from './pages/drivers/drivers';
import { VehiclesComponent } from './pages/vehicles/vehicles';
import { TripsComponent } from './pages/trips/trips';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'trips', component: TripsComponent },
];
