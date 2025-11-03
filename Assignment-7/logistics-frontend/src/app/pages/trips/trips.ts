import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Driver {
  id: number;
  name: string;
  isAvailable?: boolean;
}

interface Vehicle {
  id: number;
  numberPlate: string;
  isAvailable?: boolean;
}

interface Trip {
  id?: number;
  driverId: number;
  vehicleId: number;
  startTime: string;
  endTime?: string;
  source: string;
  destination: string;
  durationHours?: number; // for >8 hours trips
  driver?: Driver;
  vehicle?: Vehicle;
}

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class TripsComponent implements OnInit {

  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];

  trip: Trip = {
    driverId: 0,
    vehicleId: 0,
    startTime: '',
    source: '',
    destination: ''
  };

  private tripUrl = 'http://localhost:5023/api/Trips';
  private driverUrl = 'http://localhost:5023/api/Drivers';
  private vehicleUrl = 'http://localhost:5023/api/Vehicles';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.getDrivers();
    this.getVehicles();
    this.getTripsWithFilter();
  }

  getTripsWithFilter(): void {
    this.http.get<Trip[]>(this.tripUrl).subscribe({
      next: (data) => {
        this.trips = data;

        this.route.queryParams.subscribe(params => {
          const filter = params['filter'];
          if (filter === 'active') {
            this.filteredTrips = this.trips.filter(t => !t.endTime);
          } else if (filter === 'completed') {
            this.filteredTrips = this.trips.filter(t => !!t.endTime);
          } else if (filter === 'long') {
            this.getLongTrips(); // fetch from API endpoint for >8 hr trips
          } else {
            this.filteredTrips = this.trips;
          }
        });
      },
      error: (err) => console.error('Error loading trips', err)
    });
  }

  getLongTrips(): void {
    this.http.get<Trip[]>(`${this.tripUrl}/long-trips`).subscribe({
      next: (data) => this.filteredTrips = data,
      error: (err) => console.error('Error fetching long trips', err)
    });
  }

  getDrivers(): void {
    this.http.get<Driver[]>(this.driverUrl).subscribe({
      next: (data) => this.drivers = data,
      error: (err) => console.error('Error loading drivers', err)
    });
  }

  getVehicles(): void {
    this.http.get<Vehicle[]>(this.vehicleUrl).subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  saveTrip(): void {
    if (this.trip.id) {
      this.http.put(`${this.tripUrl}/${this.trip.id}`, this.trip).subscribe(() => {
        this.getTripsWithFilter();
        this.resetTrip();
      });
    } else {
      this.http.post(this.tripUrl, this.trip).subscribe(() => {
        this.getTripsWithFilter();
        this.resetTrip();
      });
    }
  }

  editTrip(t: Trip): void {
    this.trip = { ...t };
  }

  deleteTrip(id?: number): void {
    if (!id) return;
    this.http.delete(`${this.tripUrl}/${id}`).subscribe(() => this.getTripsWithFilter());
  }

  private resetTrip(): void {
    this.trip = {
      driverId: 0,
      vehicleId: 0,
      startTime: '',
      source: '',
      destination: ''
    };
  }
}
