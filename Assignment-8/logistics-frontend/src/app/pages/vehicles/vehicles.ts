import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  filteredVehicles: Vehicle[] = [];
  showModal = false;
  vehicle: Vehicle = {
    numberPlate: '',
    type: '',
    capacity: 0,
    source: '',
    destination: '',
    isAvailable: true
  };
  apiUrl = 'http://localhost:5023/api/Vehicles';
  currentUser: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.route.queryParams.subscribe(params => {
      const filter = params['filter'] || 'all';
      this.getVehicles(filter);
    });
  }

  // ✅ Get token headers for secured API calls
  private getAuthHeaders(): HttpHeaders {
    const token = this.currentUser?.token;
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // ✅ Load vehicles from API
  getVehicles(filter: string = 'all') {
    const headers = this.getAuthHeaders();
    this.http.get<Vehicle[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        // Sort available vehicles first
        this.vehicles = data.sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
        this.filteredVehicles =
          filter === 'available' ? this.vehicles.filter(v => v.isAvailable) : [...this.vehicles];
      },
      error: (err) => console.error('Error loading vehicles:', err)
    });
  }

  // ✅ Open modal (Add or Edit)
  openModal(vehicle?: Vehicle) {
    this.vehicle = vehicle
      ? { ...vehicle }
      : { numberPlate: '', type: '', capacity: 0, source: '', destination: '', isAvailable: true };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ✅ Save or update vehicle
  saveVehicle() {
    const headers = this.getAuthHeaders();
    if (this.vehicle.id) {
      // Update
      this.http.put(`${this.apiUrl}/${this.vehicle.id}`, this.vehicle, { headers }).subscribe({
        next: () => {
          window.alert('Vehicle updated successfully!');
          this.getVehicles();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating vehicle:', err);
          window.alert('Failed to update vehicle. Try again.');
        }
      });
    } else {
      // Add
      this.http.post(this.apiUrl, this.vehicle, { headers }).subscribe({
        next: () => {
          window.alert('Vehicle added successfully!');
          this.getVehicles();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error adding vehicle:', err);
          window.alert('Failed to add vehicle. Try again.');
        }
      });
    }
  }

  // ✅ Delete vehicle with confirmation
  deleteVehicle(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    const headers = this.getAuthHeaders();
    this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: () => {
        window.alert('Vehicle deleted successfully!');
        this.getVehicles();
      },
      error: (err) => {
        console.error('Error deleting vehicle:', err);
        window.alert('Failed to delete vehicle. Try again.');
      }
    });
  }
}
