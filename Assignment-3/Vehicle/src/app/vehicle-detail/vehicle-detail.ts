// vehicle-detail.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Vehicle {
  id: number;
  numberPlate: string;
  type: string;
  capacity: number;
  status: string;
}

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-detail.html',
  styleUrls: ['./vehicle-detail.css']
})
export class VehicleDetail {
  @Input() vehicle!: Vehicle;
}
