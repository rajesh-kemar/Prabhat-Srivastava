import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

// -------------------------
// Interfaces
// -------------------------
export interface Trip {
  id?: number;
  driverId: number;
  vehicleId: number;
  startTime: string;
  endTime?: string | null;
  source: string;
  destination: string;
  status?: string; // <-- status from backend
}

export interface Driver {
  id?: number;
  Name: string;
}

export interface Vehicle {
  id?: number;
  NumberPlate: string;
}

// -------------------------
// Services
// -------------------------
@Injectable({ providedIn: 'root' })
export class TripService {
  private apiUrl = 'http://localhost:5023/api/Trips';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  create(trip: Trip): Observable<Trip> {
    const payload = { ...trip };
    delete payload.id;
    return this.http.post<Trip>(this.apiUrl, payload);
  }

  update(id: number, trip: Trip): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, trip);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class DriverService {
  private apiUrl = 'http://localhost:5023/api/Drivers';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Driver[]> { return this.http.get<Driver[]>(this.apiUrl); }
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiUrl = 'http://localhost:5023/api/Vehicles';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(this.apiUrl); }
}

// -------------------------
// Component
// -------------------------
@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './trip.html',
  styleUrls: ['./trip.css']
})
export class TripComponent implements OnInit {
  trips: Trip[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  trip: Trip = { driverId: 0, vehicleId: 0, startTime: '', endTime: null, source: '', destination: '' };
  editMode = false;

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.loadTrips();
    this.loadDrivers();
    this.loadVehicles();
  }

  // Load data
  loadTrips() { this.tripService.getAll().subscribe(t => this.trips = t); }
  loadDrivers() { this.driverService.getAll().subscribe(d => this.drivers = d); }
  loadVehicles() { this.vehicleService.getAll().subscribe(v => this.vehicles = v); }

  // CRUD Operations
  saveTrip() {
    if (this.editMode && this.trip.id != null) {
      this.tripService.update(this.trip.id, this.trip).subscribe(() => { this.loadTrips(); this.resetForm(); });
    } else {
      this.tripService.create(this.trip).subscribe(() => { this.loadTrips(); this.resetForm(); });
    }
  }

  editTrip(t: Trip) {
    this.trip = {
      ...t,
      startTime: t.startTime ? new Date(t.startTime).toISOString().slice(0,16) : '',
      endTime: t.endTime ? new Date(t.endTime).toISOString().slice(0,16) : null
    };
    this.editMode = true;
  }

  deleteTrip(id: number) {
    if(confirm('Are you sure you want to delete this trip?')) {
      this.tripService.delete(id).subscribe(() => this.loadTrips());
    }
  }

  resetForm() {
    this.trip = { driverId: 0, vehicleId: 0, startTime: '', endTime: null, source: '', destination: '' };
    this.editMode = false;
  }

  // Helpers
  getDriverName(id: number): string {
    const driver = this.drivers.find(d => d.id === id);
    return driver ? driver.Name : 'Unknown';
  }

  getVehicleNumberPlate(id: number): string {
    const vehicle = this.vehicles.find(v => v.id === id);
    return vehicle ? vehicle.NumberPlate : 'Unknown';
  }
}
