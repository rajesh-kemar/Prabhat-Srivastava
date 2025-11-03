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

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.http.get<Driver[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.drivers = data;

        // Apply filter from query params if present
        this.route.queryParams.subscribe(params => {
          const filter = params['filter'];
          this.applyFilter(filter);
        });
      },
      error: (err) => console.error('Error loading drivers:', err)
    });
  }

  applyFilter(filter?: string): void {
    if (filter === 'available') {
      this.filteredDrivers = this.drivers.filter(d => d.isAvailable);
    } else {
      this.filteredDrivers = this.drivers;
    }
  }

  saveDriver(): void {
    if (this.driver.id) {
      // Update driver
      this.http.put(`${this.apiUrl}/${this.driver.id}`, this.driver).subscribe({
        next: () => {
          this.loadDrivers();
          this.resetDriver();
        },
        error: (err) => console.error('Error updating driver:', err)
      });
    } else {
      // Add driver
      this.http.post(this.apiUrl, this.driver).subscribe({
        next: () => {
          this.loadDrivers();
          this.resetDriver();
        },
        error: (err) => console.error('Error adding driver:', err)
      });
    }
  }

  editDriver(d: Driver): void {
    this.driver = { ...d };
  }

  deleteDriver(id?: number): void {
    if (!id) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadDrivers(),
      error: (err) => console.error('Error deleting driver:', err)
    });
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
}
