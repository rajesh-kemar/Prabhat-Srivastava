import { Routes } from '@angular/router';
import { VehicleList } from './vehicle-list/vehicle-list';

export const routes: Routes = [
    {path: '', redirectTo: 'VehicleList', pathMatch: 'full'},
    { path:'VehicleList', component: VehicleList  }
];
