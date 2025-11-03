import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="app-container">
      <!-- <router-outlet></router-outlet> -->
      <h1>🚚 Transport Management</h1>

      <nav>
        <a routerLink="/Drivers" routerLinkActive="active-link">Driver</a>
        <a routerLink="/Vehicles" routerLinkActive="active-link">Vehicle</a>
        <a routerLink="/Trips" routerLinkActive="active-link">Trip</a>
      </nav>

    <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class AppComponent {}
