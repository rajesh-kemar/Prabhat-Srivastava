import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Driver {
  id?: number;
  name: string;
  phone: string;
  drivingLicense: string;
  experienceYears: number;
  isAvailable?: boolean;
}

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './driver.html',
  styleUrls: ['./driver.css']
})
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  driver: Driver = { name: '', phone: '', drivingLicense: '', experienceYears: 0, isAvailable: true };
  editMode = false;
  private apiUrl = 'http://localhost:5023/api/Drivers';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDrivers();
  }

  // -----------------
  // Service Methods
  // -----------------
  getAll(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  get(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  create(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  update(id: number, driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${id}`, driver);
  }

  deleteDriverById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // -----------------
  // Component Methods
  // -----------------
  loadDrivers() {
    this.getAll().subscribe(drivers => this.drivers = drivers);
  }

  saveDriver() {
    if (this.editMode && this.driver.id) {
      this.update(this.driver.id, this.driver).subscribe(() => {
        this.loadDrivers();
        this.resetForm();
      });
    } else {
      this.create(this.driver).subscribe(() => {
        this.loadDrivers();
        this.resetForm();
      });
    }
  }

  editDriver(d: Driver) {
    this.driver = { ...d };
    this.editMode = true;
  }

  deleteDriver(id: number) {
    this.deleteDriverById(id).subscribe(() => this.loadDrivers());
  }

  resetForm() {
    this.driver = { name: '', phone: '', drivingLicense: '', experienceYears: 0, isAvailable: true };
    this.editMode = false;
  }
}
