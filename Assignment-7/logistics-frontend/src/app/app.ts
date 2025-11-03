import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a routerLink="/dashboard">Dashboard</a> 
      <a routerLink="/drivers">Drivers</a> 
      <a routerLink="/vehicles">Vehicles</a> 
      <a routerLink="/trips">Trips</a> 
    </nav>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./app.css']   
})
export class AppComponent { }