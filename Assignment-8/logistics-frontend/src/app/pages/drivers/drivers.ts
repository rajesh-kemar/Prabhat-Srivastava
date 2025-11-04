import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Driver {
  id?: number;
  name: string;
  phone: string;
  drivingLicense: string;
  experienceYears: number;
  isAvailable: boolean;
}

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './drivers.html',
  styleUrls: ['./drivers.css']
})
export class DriversComponent implements OnInit {

  drivers: Driver[] = [];
  filteredDrivers: Driver[] = [];
  driver: Driver = {
    name: '',
    phone: '',
    drivingLicense: '',
    experienceYears: 0,
    isAvailable: true
  };

  private apiUrl = 'http://localhost:5023/api/Drivers';
  isModalVisible: boolean = false; // Modal visibility state

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  private getAuthHeaders() {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}')?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  loadDrivers(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const role = currentUser?.role;

    this.http.get<Driver[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
      next: (data) => {
        this.drivers = data.sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
        this.filteredDrivers = (role === 'Driver')
          ? this.drivers.filter(d => d.name === currentUser?.username)
          : [...this.drivers];
      },
      error: (err) => console.error('Error loading drivers:', err)
    });
  }

  saveDriver(): void {
    if (this.driver.id) {
      this.http.put(`${this.apiUrl}/${this.driver.id}`, this.driver, this.getAuthHeaders())
        .subscribe(() => { this.loadDrivers(); this.resetDriver(); this.closeModal(); });
    } else {
      this.http.post(this.apiUrl, this.driver, this.getAuthHeaders())
        .subscribe(() => { this.loadDrivers(); this.resetDriver(); this.closeModal(); });
    }
  }

  editDriver(d: Driver): void { 
    this.driver = { ...d }; 
    this.openModal();
  }

  deleteDriver(id?: number): void {
    if (!id) return;
    this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders())
      .subscribe(() => this.loadDrivers());
  }

  private resetDriver(): void {
    this.driver = { name: '', phone: '', drivingLicense: '', experienceYears: 0, isAvailable: true };
  }

  // Modal control methods
  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
