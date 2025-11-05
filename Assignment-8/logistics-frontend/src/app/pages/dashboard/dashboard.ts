import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Driver {
  id?: number;
  name: string;
  isAvailable?: boolean;
}

interface Vehicle {
  id?: number;
  numberPlate: string;
  isAvailable?: boolean;
}

interface Trip {
  id?: number;
  driverId: number;
  vehicleId: number;
  startTime: string;
  endTime?: string;
  durationHours?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  role: string = '';

  // Dashboard data holders
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  trips: Trip[] = [];

  // Dispatcher Stats
  totalDrivers = 0;
  availableDrivers = 0;
  totalVehicles = 0;
  availableVehicles = 0;
  activeTrips = 0;
  completedTrips = 0;

  // Driver Stats
  totalDrivingHours = 0;

  // Backend API endpoints
  private driverUrl = 'http://localhost:5023/api/Drivers';
  private vehicleUrl = 'http://localhost:5023/api/Vehicles';
  private tripUrl = 'http://localhost:5023/api/Trips';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Fetch current user from local storage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.role = this.currentUser?.role || '';

    // If no user or role → redirect to login
    if (!this.currentUser || !this.role) {
      this.router.navigate(['/login']);
      return;
    }

    // Load data based on role
    this.loadStats();
  }

  // Helper: Add JWT Authorization header
  private getAuthHeaders() {
    const token = this.currentUser?.token;
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // Load stats based on role
  loadStats() {
    if (this.role === 'Dispatcher') {
      this.loadAllData();
    } else if (this.role === 'Driver') {
      this.loadDriverStats();
    }
  }

  // =======================
  // DISPATCHER DASHBOARD
  // =======================
  loadAllData() {
    // Load Drivers
    this.http.get<Driver[]>(this.driverUrl, this.getAuthHeaders()).subscribe({
      next: data => {
        this.drivers = data;
        this.totalDrivers = data.length;
        this.availableDrivers = data.filter(d => d.isAvailable).length;
      },
      error: err => {
        console.error('Error loading drivers:', err);
      }
    });

    // Load Vehicles
    this.http.get<Vehicle[]>(this.vehicleUrl, this.getAuthHeaders()).subscribe({
      next: data => {
        this.vehicles = data;
        this.totalVehicles = data.length;
        this.availableVehicles = data.filter(v => v.isAvailable).length;
      },
      error: err => {
        console.error('Error loading vehicles:', err);
      }
    });

    // Load Trips
    this.http.get<Trip[]>(this.tripUrl, this.getAuthHeaders()).subscribe({
      next: data => {
        this.trips = data;
        this.activeTrips = data.filter(t => !t.endTime).length;
        this.completedTrips = data.filter(t => !!t.endTime).length;
      },
      error: err => {
        console.error('Error loading trips:', err);
      }
    });
  }

  // =======================
  // DRIVER DASHBOARD
  // =======================
  loadDriverStats() {
    const driverId = this.currentUser?.id;
    if (!driverId) return;

    this.http.get<Trip[]>(this.tripUrl, this.getAuthHeaders()).subscribe({
      next: data => {
        const driverTrips = data.filter(t => t.driverId === driverId);

        // Active trips
        this.activeTrips = driverTrips.filter(t => !t.endTime).length;

        // Completed trips
        const completed = driverTrips.filter(t => !!t.endTime);
        this.completedTrips = completed.length;

        // Total driving hours
        this.totalDrivingHours = completed.reduce((sum, t) => {
          const start = new Date(t.startTime).getTime();
          const end = new Date(t.endTime!).getTime();
          return sum + (end - start) / (1000 * 60 * 60);
        }, 0);

        // Round to 1 decimal
        this.totalDrivingHours = Math.round(this.totalDrivingHours * 10) / 10;
      },
      error: err => {
        console.error('Error loading driver stats:', err);
      }
    });
  }

  // =======================
  // NAVIGATION HANDLER
  // =======================
  navigateTo(type: string, status: string) {
    let url = '';

    if (type === 'trips') url = '/trips';
    else if (type === 'vehicles') url = '/vehicles';
    else if (type === 'drivers') url = '/drivers';

    // Add query filter for target view
    this.router.navigate([url], { queryParams: { filter: status } });
  }
}
