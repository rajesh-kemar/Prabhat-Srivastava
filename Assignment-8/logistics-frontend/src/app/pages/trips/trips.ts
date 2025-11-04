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
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}')?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  private formatSecondsToHHMMSS(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  }

  loadAllData(): void {
    this.getDrivers();
    this.getVehicles();
    this.getTrips();
  }

  getDrivers(): void {
    this.http.get<Driver[]>(this.driverUrl, this.getAuthHeaders()).subscribe({
      next: (data) => (this.drivers = data.filter(d => d.isAvailable)),
      error: (err) => console.error('Error loading drivers:', err)
    });
  }

  getVehicles(): void {
    this.http.get<Vehicle[]>(this.vehicleUrl, this.getAuthHeaders()).subscribe({
      next: (data) => (this.vehicles = data.filter(v => v.isAvailable)),
      error: (err) => console.error('Error loading vehicles:', err)
    });
  }

  getTrips(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const role = currentUser?.role;
    const driverId = currentUser?.id;
    const endpoint = role === 'Driver' ? `${this.tripUrl}/MyTrips` : this.tripUrl;

    this.http.get<Trip[]>(endpoint, this.getAuthHeaders()).subscribe({
      next: (data) => {
        this.trips = role === 'Driver' ? data.filter(t => t.driverId === driverId) : data;

        this.trips.forEach(t => {
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

        // Filter trips by query params
        this.route.queryParams.subscribe(params => {
          const filter = params['filter'];
          if (filter === 'active') this.filteredTrips = this.trips.filter(t => !t.endTime);
          else if (filter === 'completed') this.filteredTrips = this.trips.filter(t => !!t.endTime);
          else this.filteredTrips = [...this.trips];
        });
      },
      error: (err) => console.error('Error loading trips:', err)
    });
  }

  openTripModal(): void {
    if (this.role !== 'Dispatcher') return;
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

  saveTrip(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const role = currentUser?.role || '';

    if (this.trip.id && this.trip.endTime) {
      const id = this.trip.id;
      const payload = { endTime: this.trip.endTime || new Date().toISOString() };
      const url = `${this.tripUrl}/complete/${id}`;

      this.http.put(url, payload, this.getAuthHeaders()).subscribe({
        next: (res: any) => {
          alert(res?.message || 'Trip completed successfully!');
          this.getTrips();
          this.closeTripModal();
        },
        error: (err) => {
          console.error('Error completing trip:', err);
          alert('Failed to complete trip.');
        }
      });
      return;
    }

    if (role === 'Dispatcher') {
      const request = this.trip.id
        ? this.http.put(`${this.tripUrl}/${this.trip.id}`, this.trip, this.getAuthHeaders())
        : this.http.post(this.tripUrl, this.trip, this.getAuthHeaders());

      request.subscribe({
        next: () => {
          alert('Trip saved successfully!');
          this.getTrips();
          this.closeTripModal();
        },
        error: (err) => {
          console.error('Error saving trip:', err);
          alert('Failed to save trip.');
        }
      });
    } else {
      alert('Only a dispatcher can add or modify trips.');
    }
  }

  deleteTrip(id?: number): void {
    if (!id || this.role !== 'Dispatcher') return;
    if (!confirm('Are you sure you want to delete this trip?')) return;

    this.http.delete(`${this.tripUrl}/${id}`, this.getAuthHeaders()).subscribe({
      next: () => {
        alert('Trip deleted successfully.');
        this.getTrips();
      },
      error: (err) => console.error('Error deleting trip:', err)
    });
  }

  resetTrip(): void {
    this.trip = { driverId: 0, vehicleId: 0, startTime: '', source: '', destination: '' };
  }
}
