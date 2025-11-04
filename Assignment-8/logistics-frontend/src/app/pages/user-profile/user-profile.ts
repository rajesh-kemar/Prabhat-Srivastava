import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  driverTrips: any[] = [];
  driverVehicle: any = null;
  totalTrips: number = 0;
  totalVehicles: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.loadDriverData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  /** 🚗 Load driver-specific data */
  async loadDriverData() {
    if (this.user.role !== 'Driver') return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // ✅ 1️⃣ Fetch All Trips
      const tripResponse = await fetch('http://localhost:5023/api/Trips', { headers });
      const trips = await tripResponse.json();

      // Filter only this driver’s trips
      this.driverTrips = trips.filter((t: any) => t.driverId === this.user.id);
      this.totalTrips = this.driverTrips.length;

      // ✅ 2️⃣ Fetch All Vehicles
      const vehicleResponse = await fetch('http://localhost:5023/api/Vehicles', { headers });
      const vehicles = await vehicleResponse.json();

      // Prefer direct driver-to-vehicle mapping if available
      this.driverVehicle = vehicles.find((v: any) => v.driverId === this.user.id);

      if (this.driverVehicle) {
        this.totalVehicles = 1;
      } else if (this.driverTrips.length > 0) {
        // fallback: find by vehicleId from first trip
        const vehicleFromTrip = vehicles.find(
          (v: any) => v.id === this.driverTrips[0].vehicleId
        );
        if (vehicleFromTrip) {
          this.driverVehicle = vehicleFromTrip;
          this.totalVehicles = 1;
        } else {
          this.totalVehicles = 0;
        }
      } else {
        this.totalVehicles = 0;
      }
    } catch (error) {
      console.error('❌ Error fetching driver data:', error);
    }
  }

  goToPage(path: string) {
    this.router.navigate([path]);
  }
}
