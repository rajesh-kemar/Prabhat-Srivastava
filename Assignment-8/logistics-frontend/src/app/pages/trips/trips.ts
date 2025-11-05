import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Driver {
  id: number;
  name: string;
  isAvailable: boolean;
}

interface Vehicle {
  id: number;
  numberPlate: string;
  isAvailable: boolean;
}

interface Trip {
  id?: number;
  driverId: number;
  vehicleId: number;
  startTime: string;
  endTime?: string;
  source: string;
  destination: string;
  durationFormatted?: string;
  durationDays?: number;
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
  role: string = '';
  showTripModal: boolean = false;
  trip: Trip = { driverId: 0, vehicleId: 0, startTime: '', source: '', destination: '' };

  private tripUrl = 'http://localhost:5023/api/Trips';
  private driverUrl = 'http://localhost:5023/api/Drivers';
  private vehicleUrl = 'http://localhost:5023/api/Vehicles';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.role = currentUser?.role || '';
    this.loadAllData();
  }

  private getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return { headers: { Authorization: `Bearer ${user.token || user.accessToken}` } };
  }

  private formatSecondsToHHMMSS(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  loadAllData(): void {
    this.getDrivers();
    this.getVehicles();
    this.getTrips();
  }

  getDrivers(): void {
    this.http.get<Driver[]>(this.driverUrl, this.getAuthHeaders()).subscribe({
      next: (data) => (this.drivers = data.filter((d) => d.isAvailable)),
      error: () => alert('Failed to load drivers')
    });
  }

  getVehicles(): void {
    this.http.get<Vehicle[]>(this.vehicleUrl, this.getAuthHeaders()).subscribe({
      next: (data) => (this.vehicles = data.filter((v) => v.isAvailable)),
      error: () => alert('Failed to load vehicles')
    });
  }

  getTrips(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const role = currentUser?.role;
    const driverId = currentUser?.id;
    const endpoint = this.tripUrl;

    this.http.get<Trip[]>(endpoint, this.getAuthHeaders()).subscribe({
      next: (data) => {
        this.trips = role === 'Driver' ? data.filter((t) => t.driverId === driverId) : data;
        this.trips.forEach((t) => {
          if (t.startTime && t.endTime) {
            const start = new Date(t.startTime).getTime();
            const end = new Date(t.endTime).getTime();
            const totalSeconds = Math.floor((end - start) / 1000);
            t.durationFormatted = this.formatSecondsToHHMMSS(totalSeconds);
            t.durationDays = +(totalSeconds / 3600 / 8).toFixed(2);
          } else {
            t.durationFormatted = '-';
            t.durationDays = 0;
          }
        });
        this.route.queryParams.subscribe((params) => {
          const filter = params['filter'];
          if (filter === 'active') this.filteredTrips = this.trips.filter((t) => !t.endTime);
          else if (filter === 'completed') this.filteredTrips = this.trips.filter((t) => !!t.endTime);
          else this.filteredTrips = [...this.trips];
        });
      },
      error: () => alert('Failed to load trips')
    });
  }

  openTripModal(): void {
    if (this.role !== 'Dispatcher') {
      alert('Only dispatcher can add trips');
      return;
    }
    this.resetTrip();
    this.showTripModal = true;
  }

  editTrip(t: Trip): void {
    this.trip = { ...t };
    if (!this.trip.endTime) this.trip.endTime = new Date().toISOString();
    this.showTripModal = true;
  }

  closeTripModal(): void {
    this.showTripModal = false;
  }

  private isTripValid(): boolean {
    if (!this.trip.driverId || !this.trip.vehicleId) {
      alert('Select driver and vehicle');
      return false;
    }
    if (!this.trip.startTime?.trim() || !this.trip.source?.trim() || !this.trip.destination?.trim()) {
      alert('All fields are required');
      return false;
    }
    return true;
  }

  saveTrip(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const role = currentUser?.role || '';

    if (!this.isTripValid()) return;

    if (this.trip.id && this.trip.endTime) {
      const url = `${this.tripUrl}/complete/${this.trip.id}`;
      const payload = { endTime: this.trip.endTime };
      this.http.put(url, payload, this.getAuthHeaders()).subscribe({
        next: (res: any) => {
          alert(res?.message || 'Trip completed');
          this.getTrips();
          this.closeTripModal();
        },
        error: () => alert('Failed to complete trip')
      });
      return;
    }

    if (role === 'Dispatcher') {
      const request = this.trip.id
        ? this.http.put(`${this.tripUrl}/${this.trip.id}`, this.trip, this.getAuthHeaders())
        : this.http.post(this.tripUrl, this.trip, this.getAuthHeaders());
      request.subscribe({
        next: () => {
          alert(this.trip.id ? 'Trip updated' : 'Trip created');
          this.getTrips();
          this.closeTripModal();
        },
        error: () => alert('Failed to save trip')
      });
    } else {
      alert('Only dispatcher can modify trips');
    }
  }

  deleteTrip(id?: number): void {
    if (!id || this.role !== 'Dispatcher') return;
    if (!confirm('Are you sure?')) return;

    this.http.delete(`${this.tripUrl}/${id}`, this.getAuthHeaders()).subscribe({
      next: () => {
        alert('Trip deleted');
        this.getTrips();
      },
      error: () => alert('Failed to delete trip')
    });
  }

  resetTrip(): void {
    this.trip = { driverId: 0, vehicleId: 0, startTime: '', source: '', destination: '' };
  }
}
