import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

// Define Vehicle interface
interface Vehicle {
  id?: number;
  numberPlate: string;
  type: string;
  capacity: number;
  source: string;
  destination: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.css']
})
export class VehiclesComponent implements OnInit {

  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];  // ✅ new array for filtering
  vehicle: Vehicle = {
    numberPlate: '',
    type: '',
    capacity: 0,
    source: '',
    destination: '',
    isAvailable: true
  };

  apiUrl = 'http://localhost:5023/api/Vehicles';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getVehicles();
  }

  // ✅ Fetch vehicles and apply filter if provided
  getVehicles() {
    this.http.get<Vehicle[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.vehicles = data;
        this.route.queryParams.subscribe(params => {
          const filter = params['filter'];
          this.applyFilter(filter);
        });
      },
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  // ✅ Handle filtering
  applyFilter(filter?: string) {
    if (filter === 'available') {
      this.filteredVehicles = this.vehicles.filter(v => v.isAvailable);
    } else {
      this.filteredVehicles = this.vehicles;
    }
  }

  saveVehicle() {
    if (this.vehicle.id) {
      this.http.put(`${this.apiUrl}/${this.vehicle.id}`, this.vehicle).subscribe(() => {
        this.getVehicles();
        this.resetVehicle();
      });
    } else {
      this.http.post(this.apiUrl, this.vehicle).subscribe(() => {
        this.getVehicles();
        this.resetVehicle();
      });
    }
  }

  editVehicle(v: Vehicle) {
    this.vehicle = { ...v };
  }

  deleteVehicle(id?: number) {
    if (!id) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.getVehicles());
  }

  private resetVehicle() {
    this.vehicle = {
      numberPlate: '',
      type: '',
      capacity: 0,
      source: '',
      destination: '',
      isAvailable: true
    };
  }
}
