import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

// -------------------------
// Vehicle Interface
// -------------------------
interface Vehicle {
  id?: number;
  numberPlate: string;
  type: string;
  capacity: number;
  source: string;
  destination: string;
  isAvailable?: boolean; // added to match backend
}

// -------------------------
// Vehicle Component (standalone + service combined)
// -------------------------
@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './vehicle.html',
  styleUrls: ['./vehicle.css']
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = [];
  vehicle: Vehicle = { numberPlate: '', type: '', capacity: 0, source: '', destination: '', isAvailable: true };
  editMode = false;

  private apiUrl = 'http://localhost:5023/api/Vehicles';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVehicles();
  }

  // -----------------
  // Service Methods
  // -----------------
  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  create(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  update(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicle);
  }

  deleteVehicleById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // -----------------
  // Component Methods
  // -----------------
  loadVehicles() {
    this.getAll().subscribe(v => this.vehicles = v);
  }

  saveVehicle() {
    if (this.editMode && this.vehicle.id) {
      this.update(this.vehicle.id, this.vehicle).subscribe(() => {
        this.loadVehicles();
        this.resetForm();
      });
    } else {
      this.create(this.vehicle).subscribe(() => {
        this.loadVehicles();
        this.resetForm();
      });
    }
  }

  editVehicle(v: Vehicle) {
    this.vehicle = { ...v };
    this.editMode = true;
  }

  deleteVehicle(id: number) {
    this.deleteVehicleById(id).subscribe(() => this.loadVehicles());
  }

  resetForm() {
    this.vehicle = { numberPlate: '', type: '', capacity: 0, source: '', destination: '', isAvailable: true };
    this.editMode = false;
  }
}
