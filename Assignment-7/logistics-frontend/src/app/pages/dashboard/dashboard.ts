import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

// Interfaces for type safety
interface Trip {
  id: number;
  startTime: string;
  endTime?: string;
  driverId: number;
  vehicleId: number;
}

interface Vehicle {
  id: number;
  numberPlate: string;
  isAvailable: boolean;
}

interface Driver {
  id: number;
  name: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  activeTrips = 0;
  completedTrips = 0;
  totalVehicles = 0;
  availableVehicles = 0;
  totalDrivers = 0;          // ✅ added missing declaration
  availableDrivers = 0;

  private tripUrl = 'http://localhost:5023/api/Trips';
  private vehicleUrl = 'http://localhost:5023/api/Vehicles';
  private driverUrl = 'http://localhost:5023/api/Drivers';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
  }

  // ✅ Load Dashboard Statistics
  loadStats(): void {
    // Load Trips data
    this.http.get<Trip[]>(this.tripUrl).subscribe({
      next: (trips) => {
        this.activeTrips = trips.filter(t => !t.endTime).length;
        this.completedTrips = trips.filter(t => !!t.endTime).length;
      },
      error: (err) => console.error('Error loading trips', err)
    });

    // Load Vehicles data
    this.http.get<Vehicle[]>(this.vehicleUrl).subscribe({
      next: (vehicles) => {
        this.totalVehicles = vehicles.length;
        this.availableVehicles = vehicles.filter(v => v.isAvailable).length;
      },
      error: (err) => console.error('Error loading vehicles', err)
    });

    // Load Drivers data
    this.http.get<Driver[]>(this.driverUrl).subscribe({
      next: (drivers) => {
        this.totalDrivers = drivers.length;
        this.availableDrivers = drivers.filter(d => d.isAvailable).length;
      },
      error: (err) => console.error('Error loading drivers', err)
    });
  }

  // ✅ Navigate to other pages (Drivers, Vehicles, Trips)
  navigateTo(page: string, filter?: string): void {
    this.router.navigate([`/${page}`], { queryParams: { filter } });
  }
}
