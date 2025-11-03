import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';    
import { VehicleDetail } from '../vehicle-detail/vehicle-detail';

interface Vehicle {
  id: number;
  numberPlate: string;
  type: string;
  capacity: number;
  status: string;
}

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VehicleDetail
  ],
  templateUrl: './vehicle-list.html',
  styleUrls: ['./vehicle-list.css']
})

export class VehicleList {
  vehicles: Vehicle[] = [
    {id: 1, numberPlate: 'UP32AA1001', type: 'Truck', capacity: 20.0, status:'Available'},
    {id: 2, numberPlate: 'UP32AA1002', type: 'Mini-Truck', capacity: 10.0, status:'In Use'},
    {id: 3, numberPlate: 'UP32AA1003', type: 'Van', capacity: 8.0, status:'Maintenance'},
    {id: 4, numberPlate: 'UP32AA1004', type: 'Truck', capacity: 25.0, status:'Available'},
    {id: 5, numberPlate: 'UP32AA1005', type: 'Container', capacity: 30.0, status:'In Use'}
  ];

  selectedVehicle?: Vehicle;

  allStatuses: string[] = ['Available', 'In Use', 'Maintenance'];
  selectedStatuses: string[] = [];

  get filteredVehicles(): Vehicle[] { 
    if (this.selectedStatuses.length === 0) return this.vehicles;
    return this.vehicles.filter(v => this.selectedStatuses.includes(v.status));
  }

  toggleStatusFilter(status: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedStatuses.includes(status)) {
        this.selectedStatuses.push(status);
      }
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    }
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
  }
}
