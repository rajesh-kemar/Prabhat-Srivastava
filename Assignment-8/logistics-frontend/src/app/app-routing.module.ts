import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { TripsComponent } from './pages/trips/trips';
import { VehiclesComponent } from './pages/vehicles/vehicles';
import { DriversComponent } from './pages/drivers/drivers';
import { UserProfileComponent } from './pages/user-profile/user-profile';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'trips/:status', component: TripsComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'vehicles/:status', component: VehiclesComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'drivers/:status', component: DriversComponent },
  { path: 'profile', component: UserProfileComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
