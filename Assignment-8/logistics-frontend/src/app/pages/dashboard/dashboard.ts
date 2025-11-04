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
  source: string;
  destination: string;
  driver?: Driver;
  vehicle?: Vehicle;
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

  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  trips: Trip[] = [];

  activeTrips: number = 0;
  completedTrips: number = 0;
  totalDrivingHours: number = 0;
  totalDrivers: number = 0;
  availableDrivers: number = 0;
  totalVehicles: number = 0;
  availableVehicles: number = 0;

  showTripDetails: boolean = false;
  completedTripDetails: Trip[] = [];

  private driverUrl = 'http://localhost:5023/api/Drivers';
  private vehicleUrl = 'http://localhost:5023/api/Vehicles';
  private tripUrl = 'http://localhost:5023/api/Trips';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.role = this.currentUser?.role || '';

    if (!this.currentUser || !this.role) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadStats();
  }

  private getAuthHeaders() {
    const token = this.currentUser?.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };
  }

  loadStats(): void {
    if (this.role === 'Dispatcher') {
      this.loadAllData();
    } else if (this.role === 'Driver') {
      this.loadDriverStats();
    }
  }

  loadAllData(): void {
    this.loadData(this.driverUrl, 'drivers');
    this.loadData(this.vehicleUrl, 'vehicles');
    this.loadData(this.tripUrl, 'trips');
  }

  loadData(url: string, type: string): void {
    this.http.get<any[]>(url, this.getAuthHeaders()).subscribe({
      next: (data) => {
        if (type === 'drivers') {
          this.drivers = data;
          this.totalDrivers = data.length;
          this.availableDrivers = data.filter(d => d.isAvailable).length;
        } else if (type === 'vehicles') {
          this.vehicles = data;
          this.totalVehicles = data.length;
          this.availableVehicles = data.filter(v => v.isAvailable).length;
        } else if (type === 'trips') {
          this.trips = data;
          this.activeTrips = data.filter(t => !t.endTime).length;
          this.completedTrips = data.filter(t => !!t.endTime).length;
        }
      },
      error: (err) => {
        console.error(`Error loading ${type}:`, err);
        alert(`Error loading ${type}. Please try again.`);
      }
    });
  }

  loadDriverStats(): void {
    const driverId = this.currentUser?.id;
    if (!driverId) return;

    this.http.get<Trip[]>(this.tripUrl, this.getAuthHeaders()).subscribe({
      next: (data) => {
        const driverTrips = data.filter(t => t.driverId === driverId);

        this.completedTripDetails = driverTrips
          .filter(t => t.endTime)
          .map(t => {
            const start = new Date(t.startTime).getTime();
            const end = new Date(t.endTime!).getTime();
            t.durationHours = Math.round(((end - start) / (1000 * 60 * 60)) * 10) / 10;
            return t;
          });

        this.trips = driverTrips;
        this.activeTrips = driverTrips.filter(t => !t.endTime).length;
        this.completedTrips = this.completedTripDetails.length;
        this.totalDrivingHours = Math.round(
          this.completedTripDetails.reduce((sum, t) => sum + (t.durationHours || 0), 0) * 10
        ) / 10;
      },
      error: (err) => {
        console.error('Error loading driver trips:', err);
        alert('Error loading your trips. Please try again.');
      }
    });
  }

  // ✅ Redirect to Trips page for completed trips (Driver)
  viewCompletedTrips(): void {
    if (this.role === 'Driver') {
      this.router.navigate(['/trips'], {
        queryParams: {
          filter: 'completed',
          driverId: this.currentUser.id
        }
      });
    }
  }

  navigateTo(type: string, status: string): void {
    if (type === 'trips') {
      this.router.navigate(['/trips'], { queryParams: { filter: status } });
    } else if (type === 'vehicles') {
      this.router.navigate(['/vehicles'], { queryParams: { filter: status } });
    } else if (type === 'drivers') {
      this.router.navigate(['/drivers'], { queryParams: { filter: status } });
    }
  }

  closeTripDetails(): void {
    this.showTripDetails = false;
  }
}
