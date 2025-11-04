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

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getVehicles();
  }

  private getAuthHeaders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser?.token;
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : {};
  }

  getVehicles() {
    const headers = this.getAuthHeaders();
    this.http.get<Vehicle[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.vehicles = data.sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
        this.filteredVehicles = [...this.vehicles];
      },
      error: (err) => console.error('Error loading vehicles:', err)
    });
  }

  openModal(vehicle?: Vehicle) {
    this.vehicle = vehicle ? { ...vehicle } : {
      numberPlate: '',
      type: '',
      capacity: 0,
      source: '',
      destination: '',
      isAvailable: true
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveVehicle() {
    const headers = this.getAuthHeaders();
    if (this.vehicle.id) {
      this.http.put(`${this.apiUrl}/${this.vehicle.id}`, this.vehicle, { headers }).subscribe({
        next: () => {
          this.getVehicles();
          this.closeModal();
        },
        error: (err) => console.error('Error updating vehicle:', err)
      });
    } else {
      this.http.post(this.apiUrl, this.vehicle, { headers }).subscribe({
        next: () => {
          this.getVehicles();
          this.closeModal();
        },
        error: (err) => console.error('Error adding vehicle:', err)
      });
    }
  }

  deleteVehicle(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    const headers = this.getAuthHeaders();
    this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: () => this.getVehicles(),
      error: (err) => console.error('Error deleting vehicle:', err)
    });
  }
}
