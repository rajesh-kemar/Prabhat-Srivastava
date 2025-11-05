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
  isModalVisible: boolean = false;
  filter: string = 'all';
  currentUser: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'all';
      this.loadDrivers();
    });
  }

  private getAuthHeaders() {
    const token = this.currentUser?.token;
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  private applyFilter(drivers: Driver[]): Driver[] {
    let result = (this.currentUser.role === 'Driver')
      ? drivers.filter(d => d.name === this.currentUser.username)
      : [...drivers];

    if (this.filter === 'available') {
      result = result.filter(d => d.isAvailable);
    }

    return result;
  }

  loadDrivers(): void {
    this.http.get<Driver[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
      next: (data) => {
        this.drivers = data.sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
        this.filteredDrivers = this.applyFilter(this.drivers);
      },
      error: (err) => console.error('Error loading drivers:', err)
    });
  }

  saveDriver(): void {
    if (this.driver.id) {
      this.http.put(`${this.apiUrl}/${this.driver.id}`, this.driver, this.getAuthHeaders())
        .subscribe(() => {
          this.loadDrivers();
          this.resetDriver();
          this.closeModal();
        });
    } else {
      this.http.post(this.apiUrl, this.driver, this.getAuthHeaders())
        .subscribe(() => {
          this.loadDrivers();
          this.resetDriver();
          this.closeModal();
        });
    }
  }

  editDriver(d: Driver): void {
    this.driver = { ...d };
    this.openModal();
  }

  deleteDriver(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this driver?')) {
      this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders())
        .subscribe(() => this.loadDrivers());
    }
  }

  private resetDriver(): void {
    this.driver = {
      name: '',
      phone: '',
      drivingLicense: '',
      experienceYears: 0,
      isAvailable: true
    };
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
