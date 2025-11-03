// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DriverComponent } from './components/driver/driver';
import { VehicleComponent } from './components/vehicle/vehicle';
import { TripComponent } from './components/trip/trip';
import { AppComponent } from './app';


export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'Drivers', component: DriverComponent },
  { path: 'Vehicles', component: VehicleComponent },
  { path: 'Trips', component: TripComponent },
  { path: '', redirectTo: 'Driver', pathMatch: 'full' }
]; 
